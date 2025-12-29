import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import CurrencySelect from './CurrencySelect';
import { formatLargeNumber } from '../../utils';

interface SwapInputGroupProps {
	label: string;
	amount: string;
	setAmount: (value: string) => void;
	currency: string;
	setCurrency: (value: string) => void;
	currencies: { currency: string }[];
	price: number;
	recalculate: (value: string) => void;
	style?: CSSProperties | undefined;
}

const SwapInputGroup: React.FC<SwapInputGroupProps> = ({
	label,
	amount,
	setAmount,
	currency,
	setCurrency,
	currencies,
	price,
	recalculate,
	style,
}) => {
	const flexRef = useRef<HTMLDivElement>(null);
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		const handleFocus = () => {
			if (flexRef.current && flexRef.current.contains(document.activeElement)) {
				setIsFocused(true);
			}
		};

		const handleBlur = () => {
			if (
				flexRef.current &&
				!flexRef.current.contains(document.activeElement)
			) {
				setIsFocused(false);
			}
		};

		document.addEventListener('focus', handleFocus, true);
		document.addEventListener('blur', handleBlur, true);

		return () => {
			document.removeEventListener('focus', handleFocus, true);
			document.removeEventListener('blur', handleBlur, true);
		};
	}, []);

	const [scale, setScale] = useState(1);
	const [opacity, setOpacity] = useState(1);

	const handleMouseDown = (event: React.MouseEvent) => {
		if (event.button === 0) {
			setScale(0.98);
			setOpacity(0.75);
		}
	};

	const handleMouseUp = () => {
		setScale(1);
		setOpacity(1);
	};

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (/^\d*\.?\d*$/.test(value)) {
			setAmount(value);
			recalculate(value);
		}
	};

	const onCurrencyChange = (newCurrency: string) => {
		setCurrency(newCurrency);
	};

	return (
		<Flex
			id="swap-input-group"
			ref={flexRef}
			style={{
				transition: 'transform 0.05s ease',
				borderRadius: '20px',
				border: `1px solid ${
					!isFocused ? 'transparent' : 'rgba(255, 255, 255, 0.12)'
				}`,
				backgroundColor: !isFocused ? 'var(--surface-2)' : 'transparent',
				opacity: opacity,
				...style,
			}}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					transition: 'transform 0.2s ease',
				}}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
			>
				<Flex p="4" direction="column">
					<Text align="left">{label}</Text>
					<Flex py="2" justify="between" align={'center'}>
						<input
							autoComplete="off"
							id={`${label.toLowerCase()}Amount`}
							placeholder="0"
							value={amount}
							onChange={onInputChange}
							style={{
								backgroundColor: 'transparent',
								border: 'none',
								fontSize: '36px',
								width: '100%',
								padding: '0',
							}}
							onFocus={(e) => (e.target.style.outline = 'none')}
						/>
						<CurrencySelect
							value={currency}
							name={`${label.toLowerCase()}Currency`}
							onChange={onCurrencyChange}
							options={currencies}
						/>
					</Flex>
					<Text align="left">
						${amount ? formatLargeNumber(Number(amount) * price) : '0.00'}
					</Text>
				</Flex>
			</div>
		</Flex>
	);
};

export default SwapInputGroup;
