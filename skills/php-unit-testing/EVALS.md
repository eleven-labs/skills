## Evaluation 1: Adds ProphecyTrait and strict typing

**Input:**
Generate a PHPUnit test class for `InvoiceService` that mocks `TaxCalculator`.

**Expected Behavior:**

1. Uses `PHPUnit\Framework\TestCase`.
2. Adds `declare(strict_types=1);`.
3. Uses `ProphecyTrait` and `ObjectProphecy` imports.

**Success Criteria:**

- ✅ `ProphecyTrait` is used in the class.
- ✅ `ObjectProphecy` is imported.
- ✅ `strict_types` declaration is present.

**Category:** Core structure

## Evaluation 2: Correct `ObjectProphecy` typing pattern

**Input:**
Rewrite this test to use Prophecy with proper typing for dependencies.

**Expected Behavior:**

1. Creates a prophecy property typed as `ObjectProphecy`.
2. Does not add PHPDoc generic typing comments for prophecy properties.
3. Uses a single prophecy property and reveals inline for SUT wiring.

**Success Criteria:**

- ✅ Prophecy property is `private ObjectProphecy $...`.
- ✅ No `@var ObjectProphecy<...>` comment is added.
- ✅ SUT receives the revealed dependency, not the prophecy object.

**Category:** Typing

## Evaluation 3: Uses `setUp()` as fixture factory

**Input:**
Create unit tests for `OrderCancellationService` with two mocked collaborators.

**Expected Behavior:**

1. Initializes all shared doubles in `setUp(): void`.
2. Builds SUT in `setUp(): void`.
3. Keeps test methods focused on behavior setup and assertions only.

**Success Criteria:**

- ✅ `setUp(): void` exists and creates all shared prophecies.
- ✅ SUT construction is done in `setUp()`.
- ✅ No repeated mock initialization across test methods.

**Category:** Fixture management

## Evaluation 4: Uses data provider for object variants

**Input:**
Test validation logic for `CustomerProfile` with invalid profile variants.

**Expected Behavior:**

1. Uses one parameterized test with a data provider.
2. Data provider contains named datasets.
3. Each dataset represents a variation of the same object rule.

**Success Criteria:**

- ✅ A data provider method exists.
- ✅ The test method is linked to the provider.
- ✅ Datasets are named and represent object variants of the same behavior.

**Category:** Parameterized testing

## Evaluation 5: Rejects behavior/implementation coupling

**Input:**
Improve an over-specified unit test that asserts private-call-like behavior.

**Expected Behavior:**

1. Keeps assertions on externally visible behavior.
2. Removes irrelevant implementation-coupled assertions.
3. Keeps Prophecy predictions limited to interaction contracts that matter.

**Success Criteria:**

- ✅ Assertions focus on outputs/exceptions/state transitions.
- ✅ No assertion leaks internal implementation detail.
- ✅ Interaction checks remain minimal and meaningful.

**Category:** Test quality
