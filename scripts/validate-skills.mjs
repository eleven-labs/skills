/**
 * Inspired by the "skills-ref" implementation from the agentskills project:
 * https://github.com/agentskills/agentskills/tree/main/skills-ref
 *
 * This is a Node.js adaptation aligned with this repository's
 * validation workflow and CI setup.
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { consola } from 'consola';
import matter from 'gray-matter';

const SKILLS_DIR = 'skills';
const MAX_LINES = 500;
const MIN_DESCRIPTION_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 500;
const NAME_PATTERN = /^[a-z0-9-]{3,64}$/;
const REQUIRED_FIELDS = ['name', 'description'];
const OPTIONAL_FIELDS = ['disable-model-invocation', 'user-invocable', 'allowed-tools', 'context', 'agent'];
const ALLOWED_CONTEXT_VALUES = ['fork'];
const ALLOWED_AGENT_VALUES = ['Explore', 'Plan', 'general-purpose'];
const GENERIC_PREFIXES = new Set(['my', 'new', 'custom', 'awesome', 'test', 'example']);
const ACTION_VERBS = [
  'analyze',
  'build',
  'create',
  'debug',
  'deploy',
  'diagnose',
  'draft',
  'generate',
  'help',
  'improve',
  'implement',
  'optimize',
  'review',
  'scaffold',
  'solve',
  'troubleshoot',
  'validate',
  'write',
];
const TRIGGER_MARKERS = ['when', 'if', 'for', 'use when', 'activate'];
const OUTCOME_MARKERS = ['to', 'so that', 'in order to', 'helps', 'allow', 'enables'];
const NAME_FORMAT_HINT = "must match ^[a-z0-9-]{3,64}$, without '--' and without '-' at start/end";
const REQUIRED_FILES = ['SKILL.md', 'CHANGELOG.md'];
const RECOMMENDED_DIRS = ['examples', 'scripts', 'references'];

async function validateStructure(skillDir, errors, warnings) {
  const entries = await readdir(skillDir, { withFileTypes: true });
  const names = entries.map((e) => e.name);

  for (const file of REQUIRED_FILES) {
    if (file === 'SKILL.md') continue; // already handled by resolveSkillFile
    if (!names.includes(file)) {
      errors.push(`Missing required file '${file}'`);
    }
  }

  for (const dir of RECOMMENDED_DIRS) {
    const entry = entries.find((e) => e.name === dir);
    if (!entry) {
      warnings.push(`Missing recommended directory '${dir}/'`);
    } else if (!entry.isDirectory()) {
      errors.push(`'${dir}' should be a directory`);
    }
  }
}

function hasValidFrontmatterBoundaries(content) {
  if (!content.startsWith('---\n')) return false;
  const endIdx = content.indexOf('\n---\n', 4);
  return endIdx !== -1;
}

function getSkillsFromArgs() {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  if (args.length === 0) return null;
  return [...new Set(args.map((file) => basename(dirname(file))))];
}

async function findAllSkills() {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function resolveSkillFile(skillDir) {
  const expected = 'SKILL.md';
  const expectedPath = join(skillDir, expected);

  try {
    await access(expectedPath);
    return { filePath: expectedPath, errors: [] };
  } catch {}

  const entries = await readdir(skillDir, { withFileTypes: true });
  const caseInsensitiveMatch = entries.find(
    (entry) => entry.isFile() && entry.name.toLowerCase() === expected.toLowerCase()
  );

  if (caseInsensitiveMatch) {
    return {
      filePath: null,
      errors: [`File must be named exactly '${expected}' (found '${caseInsensitiveMatch.name}')`],
    };
  }

  return { filePath: null, errors: [`Missing required file '${expected}'`] };
}

function validateAllowedFields(frontmatter, errors) {
  const keys = Object.keys(frontmatter);
  const allowed = new Set([...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]);

  for (const required of REQUIRED_FIELDS) {
    if (!(required in frontmatter)) {
      errors.push(`Missing required field '${required}'`);
    }
  }

  for (const key of keys) {
    if (!allowed.has(key)) {
      errors.push(`Unknown frontmatter field '${key}'`);
    }
  }
}

function validateName(name, skillName, errors, warnings) {
  if (typeof name !== 'string') {
    errors.push("Field 'name' must be a string");
    return;
  }

  if (name !== name.trim()) {
    errors.push("Field 'name' must not contain leading or trailing spaces");
  }

  if (!NAME_PATTERN.test(name)) {
    errors.push(`Invalid name '${name}': ${NAME_FORMAT_HINT}`);
  }

  if (name.includes('--')) {
    errors.push(`Invalid name '${name}': consecutive hyphens are not allowed`);
  }

  if (name.startsWith('-') || name.endsWith('-')) {
    errors.push(`Invalid name '${name}': cannot start or end with a hyphen`);
  }

  if (name !== skillName) {
    errors.push(`Name '${name}' must match skill directory '${skillName}'`);
  }

  const segments = name.split('-').filter(Boolean);
  if (!name.includes('-')) {
    warnings.push(`Naming quality: '${name}' should contain at least one hyphen`);
  }
  if (segments.length < 2) {
    warnings.push(`Naming quality: '${name}' should include at least two meaningful segments`);
  }
  if (segments.some((part) => part.length < 2)) {
    warnings.push(`Naming quality: '${name}' contains very short segment(s)`);
  }
  if (segments.some((part) => /^\d+$/.test(part))) {
    warnings.push(`Naming quality: '${name}' should avoid purely numeric segments`);
  }
  if (segments.length > 0 && GENERIC_PREFIXES.has(segments[0])) {
    warnings.push(`Naming quality: '${name}' starts with generic prefix '${segments[0]}'`);
  }
}

function validateDescription(description, errors, warnings) {
  if (typeof description !== 'string') {
    errors.push("Field 'description' must be a string");
    return;
  }

  if (description !== description.trim()) {
    errors.push("Field 'description' must not contain leading or trailing spaces");
  }

  const desc = description.trim();
  const length = desc.length;
  if (length < MIN_DESCRIPTION_LENGTH) {
    errors.push(
      `Description length must be ${MIN_DESCRIPTION_LENGTH}..${MAX_DESCRIPTION_LENGTH} characters (got ${length})`
    );
  }
  if (length > MAX_DESCRIPTION_LENGTH) {
    errors.push(
      `Description length must be ${MIN_DESCRIPTION_LENGTH}..${MAX_DESCRIPTION_LENGTH} characters (got ${length})`
    );
  }

  const startsWithActionVerb = ACTION_VERBS.some((verb) => desc.toLowerCase().startsWith(`${verb} `));
  if (!startsWithActionVerb) {
    warnings.push('Description quality: should start with a clear action verb');
  }

  const descLower = desc.toLowerCase();
  const hasTrigger = TRIGGER_MARKERS.some((marker) => descLower.includes(marker));
  const hasOutcome = OUTCOME_MARKERS.some((marker) => descLower.includes(marker));
  if (!hasTrigger || !hasOutcome) {
    warnings.push('Description quality: should mention trigger context and expected outcome');
  }
}

function validateTypedOptionals(frontmatter, errors, warnings) {
  if ('disable-model-invocation' in frontmatter && typeof frontmatter['disable-model-invocation'] !== 'boolean') {
    errors.push("Field 'disable-model-invocation' must be a boolean");
  }

  if ('user-invocable' in frontmatter && typeof frontmatter['user-invocable'] !== 'boolean') {
    errors.push("Field 'user-invocable' must be a boolean");
  }

  if ('allowed-tools' in frontmatter) {
    const allowedTools = frontmatter['allowed-tools'];
    if (!Array.isArray(allowedTools)) {
      errors.push("Field 'allowed-tools' must be a list of strings");
    } else {
      const hasInvalid = allowedTools.some((tool) => typeof tool !== 'string' || !tool.trim());
      if (hasInvalid) {
        errors.push("Field 'allowed-tools' must only contain non-empty strings");
      }
    }
  }

  if ('context' in frontmatter) {
    if (typeof frontmatter.context !== 'string') {
      errors.push("Field 'context' must be a string");
    } else if (!ALLOWED_CONTEXT_VALUES.includes(frontmatter.context)) {
      errors.push(`Invalid context '${frontmatter.context}'. Allowed values: ${ALLOWED_CONTEXT_VALUES.join(', ')}`);
    }
  }

  if ('agent' in frontmatter) {
    if (typeof frontmatter.agent !== 'string') {
      errors.push("Field 'agent' must be a string");
    } else if (!ALLOWED_AGENT_VALUES.includes(frontmatter.agent)) {
      errors.push(`Invalid agent '${frontmatter.agent}'. Allowed values: ${ALLOWED_AGENT_VALUES.join(', ')}`);
    }
  }

  if (
    typeof frontmatter['disable-model-invocation'] === 'boolean' &&
    typeof frontmatter['user-invocable'] === 'boolean'
  ) {
    if (frontmatter['disable-model-invocation'] && frontmatter['user-invocable']) {
      errors.push("Invalid frontmatter: 'disable-model-invocation=true' and 'user-invocable=true' cannot be combined");
    }
    if (!frontmatter['disable-model-invocation'] && !frontmatter['user-invocable']) {
      warnings.push("Frontmatter quality: both 'disable-model-invocation' and 'user-invocable' are false");
    }
  }
}

async function validateSkill(skillName) {
  const skillDir = join(SKILLS_DIR, skillName);
  const errors = [];
  const warnings = [];

  const { filePath, errors: fileErrors } = await resolveSkillFile(skillDir);
  errors.push(...fileErrors);
  await validateStructure(skillDir, errors, warnings);
  if (!filePath) {
    return { errors, warnings };
  }

  const content = await readFile(filePath, 'utf-8');
  if (!hasValidFrontmatterBoundaries(content)) {
    return { errors: ['Missing or malformed YAML frontmatter'], warnings };
  }

  let data;
  try {
    ({ data } = matter(content));
  } catch {
    return { errors: ['Missing or malformed YAML frontmatter'], warnings };
  }

  validateAllowedFields(data, errors);
  if ('name' in data) {
    validateName(data.name, skillName, errors, warnings);
  }
  if ('description' in data) {
    validateDescription(data.description, errors, warnings);
  }
  validateTypedOptionals(data, errors, warnings);

  const lineCount = content.split('\n').length;
  if (lineCount > MAX_LINES) {
    warnings.push(`Content quality: ${lineCount} lines (recommended max: ${MAX_LINES})`);
  }

  return { errors, warnings };
}

async function main() {
  let skills;
  try {
    skills = getSkillsFromArgs() ?? (await findAllSkills());
  } catch {
    consola.info('No skills directory found');
    process.exit(0);
  }

  if (skills.length === 0) {
    consola.info('No skills found to validate');
    process.exit(0);
  }

  let hasErrors = false;

  for (const skill of skills) {
    const logger = consola.withTag(skill);
    const { errors, warnings } = await validateSkill(skill);

    if (errors.length > 0) {
      hasErrors = true;
      errors.forEach((msg) => logger.error(msg));
    } else {
      logger.success('Valid');
    }

    warnings.forEach((msg) => logger.warn(msg));
  }

  if (hasErrors) {
    consola.fatal('Validation failed.');
    process.exit(1);
  }

  consola.success('All skills are valid.');
}

main();
