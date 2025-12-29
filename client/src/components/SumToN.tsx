import React from 'react';
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from '../utils';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { Highlight, themes } from 'prism-react-renderer';

type Impl = {
	name: string;
	fn: (n: number) => number;
	description: string;
	complexity: {
		time: string;
		space: string;
	};
};

const implementations: Impl[] = [
	{
		name: 'sum_to_n_a',
		fn: sum_to_n_a,
		description: 'Iterative – safest general-purpose solution',
		complexity: { time: 'O(n)', space: 'O(1)' },
	},
	{
		name: 'sum_to_n_b',
		fn: sum_to_n_b,
		description: 'Formula – fastest, but assumes safe integer range.',
		complexity: { time: 'O(1)', space: 'O(1)' },
	},
	{
		name: 'sum_to_n_c',
		fn: sum_to_n_c,
		description: 'Recursive – educational only.',
		complexity: { time: 'O(n)', space: 'O(n)' },
	},
];

const formatFunctionSource = (fn: Function) => fn.toString();

const SumToN: React.FC = () => {
	const n = 888;

	return (
		<Flex direction="column" gap="4" align="center" style={{ padding: 24 }}>
			<Heading as="h1" size="5">
				Sum to N – Function Implementations
			</Heading>

			<Text color="gray">
				Input value: <strong>{n}</strong>
			</Text>

			{implementations.map(({ name, fn, description, complexity }) => (
				<Card key={name} style={{ padding: 20, width: '100%', maxWidth: 760 }}>
					<Flex direction="column" gap="3">
						<Heading as="h2" size="3">
							{name}
						</Heading>

						<Text>{description}</Text>

						<Highlight
							theme={themes.github}
							code={formatFunctionSource(fn)}
							language="ts"
						>
							{({ className, style, tokens, getLineProps, getTokenProps }) => (
								<pre
									className={className}
									style={{
										...style,
										padding: 16,
										borderRadius: 8,
										fontSize: 13,
										overflowX: 'auto',
									}}
								>
									{tokens.map((line, i) => (
										<div key={i} {...getLineProps({ line })}>
											{line.map((token, key) => (
												<span key={key} {...getTokenProps({ token })} />
											))}
										</div>
									))}
								</pre>
							)}
						</Highlight>

						<Text>
							<strong>Result:</strong> {fn(n)}
						</Text>

						<Text color="gray">
							<strong>Time:</strong> {complexity.time} · <strong>Space:</strong>{' '}
							{complexity.space}
						</Text>
					</Flex>
				</Card>
			))}
		</Flex>
	);
};

export default SumToN;
