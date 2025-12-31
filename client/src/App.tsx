import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { Box, Button, Container, Flex } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import SumToN from './components/SumToN';
import { useState } from 'react';
import SwapFormContainer from './components/SwapFormContainer';

import './App.css';

function App() {
	const [showSumToN, setShowSumToN] = useState(false);
	const [showFancyForm, setShowFancyForm] = useState(false);

	return (
		<Box
			style={{
				background: 'var(--gray-a2)',
				borderRadius: 'var(--radius-3)',
			}}
			p="8"
		>
			<Container size="4">
				<div>
					<div>
						<a href="https://vite.dev" rel="noreferrer" target="_blank">
							<img src={viteLogo} className="logo" alt="Vite logo" />
						</a>
						<a href="https://react.dev" rel="noreferrer" target="_blank">
							<img src={reactLogo} className="logo react" alt="React logo" />
						</a>
					</div>
					<Box>
						<h1>Code Challenge</h1>
						<h3>Problem 2</h3>
						<Flex direction="column" gap="2">
							<Box>
								<Button onClick={() => setShowSumToN(!showSumToN)}>
									{showSumToN ? 'Hide' : 'Show'} Sum to N Functions
								</Button>
							</Box>
						</Flex>
						{showSumToN && (
							<>
								<SumToN />
							</>
						)}
					</Box>
				</div>
				<Box>
					<h3>Problem 3</h3>
					<Flex direction="column" gap="2">
						<Box>
							<Button onClick={() => setShowFancyForm(!showFancyForm)}>
								{showFancyForm ? 'Hide' : 'Show'} Swap Form
							</Button>
						</Box>
					</Flex>
					{showFancyForm && (
						<Flex justify={'center'}>
							<Flex width={'480px'} p={'2'} justify={'center'}>
								<SwapFormContainer />
							</Flex>
						</Flex>
					)}
				</Box>
			</Container>
		</Box>
	);
}

export default App;
