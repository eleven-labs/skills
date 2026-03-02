---
name: php-unit-testing
description: Generate consistent PHP unit tests when writing or refactoring test suites, using PHPUnit and Prophecy with typed ObjectProphecy setup fixtures and data-provider coverage for object variants.
---

## Triggers

Activate this skill when the user asks to:

- write or update PHP unit tests
- improve PHPUnit test quality
- use Prophecy or `ProphecyTrait`
- refactor tests with data providers
- standardize mocking and setup patterns in PHP tests

Do NOT activate this skill for:

- integration tests or end-to-end tests
- framework-specific functional tests unless explicitly requested

## Core Standards

### 1) Test Structure

- ALWAYS use `PHPUnit\Framework\TestCase` as the base test class.
- ALWAYS keep tests focused on one unit and one behavior at a time.
- ALWAYS use intention-revealing test method names such as `it_rejects_invalid_email`.
- NEVER assert multiple unrelated behaviors in the same test.

### 2) Prophecy Usage

- ALWAYS use `Prophecy\PhpUnit\ProphecyTrait` in test classes when creating prophecies.
- ALWAYS create prophecies with `$this->prophesize(Dependency::class)`.
- ALWAYS reveal prophecy doubles with `->reveal()` only when passing collaborators to the SUT.
- NEVER mix Prophecy and other mocking styles in the same test class unless required by legacy constraints.

### 3) Correct Typing for `ObjectProphecy`

- ALWAYS declare prophecy properties with explicit typing: `private ObjectProphecy $mailerProphecy;`.
- ALWAYS rely on type inference from `$this->prophesize(Dependency::class)`.
- NEVER add PHPDoc comments for prophecy generic typing.
- NEVER create a second property for the revealed collaborator when the prophecy property is sufficient.
- NEVER pass `ObjectProphecy` directly to the SUT; pass only revealed doubles.

### 4) `setUp()` as the Single Test Fixture Entry Point

- ALWAYS initialize all shared mocks/doubles in `setUp(): void`.
- ALWAYS build the SUT in `setUp(): void` when constructor dependencies are common to all tests.
- ALWAYS keep per-test differences inside the test method itself.
- NEVER duplicate dependency instantiation across test methods when it can live in `setUp()`.

### 5) Data Provider Pattern

- ALWAYS use data providers for multiple variants of the same behavioral rule.
- ALWAYS make each dataset explicit and named.
- ALWAYS keep provider data immutable and side-effect free.
- ALWAYS assert expected outcomes for each variant in a single parameterized test.
- NEVER use data providers for unrelated scenarios.

## Required Output Format for Generated Tests

When generating or rewriting a PHP unit test file, the output MUST include:

1. `declare(strict_types=1);`
2. `use Prophecy\PhpUnit\ProphecyTrait;`
3. `use Prophecy\Prophecy\ObjectProphecy;`
4. A `setUp(): void` method that creates all shared prophecies and SUT
5. Correctly typed `ObjectProphecy` properties without PHPDoc generic comments
6. At least one data provider when multiple object variants are tested

## Reference Template

```php
<?php

declare(strict_types=1);

namespace App\Tests\Unit\Domain;

use App\Domain\Notifier;
use App\Domain\SignupService;
use App\Domain\User;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Prophecy\PhpUnit\ProphecyTrait;
use Prophecy\Prophecy\ObjectProphecy;

final class SignupServiceTest extends TestCase
{
    use ProphecyTrait;

    private ObjectProphecy $notifierProphecy;

    private SignupService $service;

    protected function setUp(): void
    {
        $this->notifierProphecy = $this->prophesize(Notifier::class);
        $this->service = new SignupService($this->notifierProphecy->reveal());
    }

    #[DataProvider('invalidUsersProvider')]
    public function testRejectsInvalidUsers(User $candidate): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->service->register($candidate);
    }

    public static function invalidUsersProvider(): iterable
    {
        yield 'empty email' => [new User('')];
        yield 'missing domain' => [new User('foo@')];
        yield 'spaces only' => [new User('   ')];
    }
}
```

## Review Checklist

Before finalizing generated tests, verify all items:

- `ProphecyTrait` is present and used
- Every prophecy property is typed `ObjectProphecy` without PHPDoc generic comments
- Shared dependencies are stored once as prophecy properties
- `setUp()` builds shared fixture once
- Data providers cover multi-variant object scenarios
- Assertions validate behavior, not implementation details

## Limitations

- This skill does not define integration test strategy.
- This skill does not replace project-specific coding standards.
- If project conventions conflict, follow project conventions and keep these rules as close as possible.
