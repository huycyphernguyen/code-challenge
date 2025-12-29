import { Flex } from '@radix-ui/themes';

interface Props {
	onClick: () => void;
}

const SwapButton = ({ onClick }: Props) => {
	return (
		<Flex width={'100%'} justify={'center'}>
			{/* SWAP BUTTON */}
			<button
				type="button"
				onClick={onClick}
				style={{
					position: 'absolute',
					transform: 'translateY(-50%)',
					backgroundColor: 'rgb(31, 31, 31)',
					border: '4px solid rgb(19, 19, 19)',
					borderRadius: '16px',
					padding: '8px',
					cursor: 'pointer',
					width: '48px',
					height: '48px',
					zIndex: 2,
				}}
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					strokeWidth="2"
					style={{
						width: '24px',
						height: '24px',
						color: 'rgb(255, 255, 255)',
						transform: 'rotateZ(0deg)',
					}}
				>
					<path
						d="M12 5V19"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					></path>
					<path
						d="M19 12L12 19L5 12"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					></path>
				</svg>
			</button>
		</Flex>
	);
};

export default SwapButton;
