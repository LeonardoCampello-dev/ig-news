import { render, screen } from '@testing-library/react';

import { stripe } from '../../services/stripe';

import { mocked } from 'ts-jest/utils';

import Home, { getStaticProps, HomeProps } from '../../pages';

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    }
  };
});

jest.mock('../../services/stripe');

const HomeFakeProps: HomeProps = {
  product: { priceId: 'price-id', amount: 'R$10,00' }
};

describe('🧪 Dado que estou na página Home', () => {
  it('As informações são renderizadas corretamente', () => {
    render(<Home product={HomeFakeProps.product} />);

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
  });

  it('Os dados iniciais são carregados', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'price-id',
      unit_amount: 1000
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'price-id',
            amount: '$10.00'
          }
        }
      })
    );
  });
});
