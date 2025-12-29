import { Spinner } from '@radix-ui/themes';
import SwapForm from './SwapForm';

async function fetchPrices() {
	const res = await fetch('https://interview.switcheo.com/prices.json');

	if (!res.ok) {
		throw new Error('Failed to fetch prices');
	}

	return res.json();
}

import { useQuery } from '@tanstack/react-query';

function usePrices() {
	return useQuery({
		queryKey: ['prices'],
		queryFn: fetchPrices,
		staleTime: 60_000, // 1 min cache
		refetchOnWindowFocus: false,
		retry: 2,
	});
}

const SwapFormContainer = () => {
	const { data: prices, isLoading, error } = usePrices();
	if (isLoading) return <Spinner />;
	if (error) throw new Error('Failed to fetch prices', error);
	return <SwapForm prices={prices} />;
};

export default SwapFormContainer;
