import { render, screen } from '@testing-library/react';

import Home, { HomeProps } from '../../pages';

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    }
  };
});

const HomeFakeProps: HomeProps = {
  product: { priceId: 'price-id', amount: 'R$10,00' }
};

describe('🧪 Dado que estou na página Home', () => {
  it('As informações são renderizadas corretamente', () => {
    render(<Home product={HomeFakeProps.product} />);

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
  });
});
