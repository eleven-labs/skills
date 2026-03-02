# Expected Output Example

```php
<?php

declare(strict_types=1);

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Prophecy\PhpUnit\ProphecyTrait;
use Prophecy\Prophecy\ObjectProphecy;

final class DiscountCalculatorTest extends TestCase
{
    use ProphecyTrait;

    private ObjectProphecy $rateProviderProphecy;

    private DiscountCalculator $calculator;

    protected function setUp(): void
    {
        $this->rateProviderProphecy = $this->prophesize(RateProvider::class);
        $this->calculator = new DiscountCalculator($this->rateProviderProphecy->reveal());
    }

    #[DataProvider('invalidAmountsProvider')]
    public function testRejectsInvalidAmounts(float $amount): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->calculator->compute($amount);
    }

    public static function invalidAmountsProvider(): iterable
    {
        yield 'negative value' => [-10.0];
        yield 'too large value' => [1000000.0];
    }
}
```
