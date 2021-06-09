import { render, screen } from '@testing-library/react';

import { ActiveLink } from '.';

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      };
    },
  };
});

/**
 * Para verificar como o HTML é renderizado, use o método debug() que é retornado do render()
 * const { debug } = render(<Component />)
 */

describe('🧪 Dado que estou no componente ActiveLink', () => {
  it('As informações são renderizadas corretamente', () => {
    render(
      <ActiveLink href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('O componente adiciona uma classe "active" se o link está ativo', () => {
    render(
      <ActiveLink href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText('Home')).toHaveClass('active');
  });
});
