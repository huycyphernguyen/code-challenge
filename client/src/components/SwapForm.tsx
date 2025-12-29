import { useMemo, useState } from 'react';
import { Flex } from '@radix-ui/themes';
import SwapInputGroup from './CurrencySelect/SwapInputGroup';
import SwapButton from './CurrencySelect/SwapButton';

type PriceRow = {
	currency: string;
	date: string;
	price: number;
};

interface Props {
	prices: PriceRow[];
}

function normalizePrices(rows: PriceRow[]) {
	const map = new Map<string, PriceRow>();

	for (const row of rows) {
		const existing = map.get(row.currency);
		if (!existing || new Date(row.date) > new Date(existing.date)) {
			map.set(row.currency, row);
		}
	}

	return Array.from(map.values());
}

const SwapForm = ({ prices }: Props) => {
	const currencies = useMemo(() => normalizePrices(prices), [prices]);

	const [fromCurrency, setFromCurrency] = useState('ETH');
	const [toCurrency, setToCurrency] = useState('USDC');
	const [fromAmount, setFromAmount] = useState('');
	const [toAmount, setToAmount] = useState('');

	const fromPrice = useMemo(() => {
		return currencies.find((c) => c.currency === fromCurrency)?.price ?? 1;
	}, [currencies, fromCurrency]);

	const toPrice = useMemo(() => {
		return currencies.find((c) => c.currency === toCurrency)?.price ?? 1;
	}, [currencies, toCurrency]);

	function recalcTo(amount: string) {
		const value = Number(amount);
		if (!amount || Number.isNaN(value)) {
			setToAmount('');
			return;
		}
		const result = (value * fromPrice) / toPrice;
		setToAmount(result.toFixed(3));
	}

	function recalcFrom(amount: string) {
		const value = Number(amount);
		if (!amount || Number.isNaN(value)) {
			setFromAmount('');
			return;
		}
		const result = (value * toPrice) / fromPrice;
		setFromAmount(result.toFixed(3));
	}

	function swapDirection() {
		setFromCurrency(toCurrency);
		setToCurrency(fromCurrency);
		setFromAmount(toAmount);
		setToAmount(fromAmount);
	}

	return (
		<form
			style={{
				width: '100%',
			}}
			onSubmit={(e) => e.preventDefault()}
		>
			<h2 className="text-lg font-semibold">Swap anytime, anywhere.</h2>
			<Flex
				// Form Container
				direction={'column'}
				style={{
					backgroundColor: 'var(--surface-1)',
					borderRadius: '24px',
					gap: '2px',
				}}
				p={'2'}
			>
				<SwapInputGroup
					label="Sell"
					amount={fromAmount}
					setAmount={setFromAmount}
					currency={fromCurrency}
					setCurrency={setFromCurrency}
					currencies={currencies}
					price={fromPrice}
					recalculate={recalcTo}
					style={{ zIndex: 2 }}
				/>

				<SwapButton onClick={swapDirection} />

				<SwapInputGroup
					label="Buy"
					amount={toAmount}
					setAmount={setToAmount}
					currency={toCurrency}
					setCurrency={setToCurrency}
					currencies={currencies}
					price={toPrice}
					recalculate={recalcFrom}
				/>

				<button
					type="submit"
					className="w-full rounded bg-black py-2 text-white"
					color="primary"
					style={{
						borderRadius: '20px',
						padding: '16px',
						paddingInline: '20px',
						outlineColor: 'rgba(0, 0, 0, 0)',
						backgroundColor: 'rgba(255, 55, 199, 0.08)',
						border: 'none',
						fontWeight: 'bold',
						color: '#FF37C7',
						marginTop: '2px',
						fontSize: '18px',
					}}
				>
					Confirm Swap
				</button>
			</Flex>
		</form>
	);
};

export default SwapForm;
