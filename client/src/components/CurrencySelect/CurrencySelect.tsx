import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Flex } from '@radix-ui/themes';
import styles from './CurrencySelect.module.css';

interface Props {
	value: string;
	name?: string;
	onChange: (v: string) => void;
	options: { currency: string }[];
	open?: boolean;
}

const CurrencySelect = ({ value, name, onChange, options, open }: Props) => {
	const baseTokenUrl =
		'https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/';
	return (
		<div className={styles.currencySelectWrapper}>
			<Select.Root
				open={open}
				value={value}
				name={name}
				onValueChange={onChange}
			>
				<Select.Trigger className={styles.currencyButton}>
					<Flex>
						<div
							style={{
								width: '28px',
								height: '28px',
								borderRadius: '50%',
								backgroundImage: `url(${baseTokenUrl}/${value}.svg)`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								backgroundRepeat: 'no-repeat',
								userSelect: 'none',
							}}
							title={`${value} icon`}
						/>
					</Flex>
					<Flex
						style={{
							fontWeight: 'bold',
							fontSize: '16px',
							height: '100%',
							alignItems: 'center',
						}}
					>
						<Select.Value />
					</Flex>
					<Flex
						style={{
							height: '100%',
							alignItems: 'center',
						}}
					>
						<ChevronDownIcon width={'24px'} height={'24px'} />
					</Flex>
				</Select.Trigger>
				<Select.Content position="popper">
					<Select.Viewport
						style={{
							maxHeight: '240px',
							backgroundColor: 'rgb(19, 19, 19)',
						}}
					>
						{options.map((o) => (
							<Select.Item key={o.currency} value={o.currency}>
								<div>
									<div
										style={{
											width: '40px',
											height: '40px',
											borderRadius: '50%',
											backgroundImage: `url(${baseTokenUrl}/${o.currency}.svg)`,
											backgroundSize: 'cover',
											backgroundPosition: 'center',
											backgroundRepeat: 'no-repeat',
										}}
										title={`${o.currency} icon`}
									/>
									<Select.ItemText>{o.currency}</Select.ItemText>
								</div>
							</Select.Item>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Root>
		</div>
	);
};

export default CurrencySelect;
