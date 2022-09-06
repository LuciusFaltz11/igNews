import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';
import { mocked } from 'ts-jest/utils';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false],
  };
});
jest.mock('../../services/stripe');

describe('Home Page', () => {
  it('renders correctly', () => {
    render(
      <Home
        product={{
          priceId: 'fake-price-id',
          amount: 'R$99,00',
        }}
      />
    );

    expect(screen.getByText('for R$99,00 month')).toBeInTheDocument;
  });

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 9900,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$99.00',
          },
        },
      })
    );
  });
});
