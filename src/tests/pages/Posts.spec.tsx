import { render, screen } from '@testing-library/react';

import { getPrismicClient } from '../../services/prismic';

import { mocked } from 'ts-jest/utils';

import Posts, { getStaticProps, Post as IPost } from '../../pages/posts';

jest.mock('../../services/prismic');

const posts: IPost[] = [
  {
    slug: 'react-testing-library',
    title: 'React Testing Library',
    excerpt: 'Test your app',
    updatedAt: 'June, 15'
  }
];

describe('🧪 Dado que estou na página Posts', () => {
  it('As informações são renderizadas corretamente', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText('React Testing Library')).toBeInTheDocument();
  });

  it('Os dados iniciais são carregados', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'react-testing-library',
            data: {
              title: [{ type: 'heading', text: 'React Testing Library' }],
              content: [{ type: 'paragraph', text: 'Test your app' }]
            },
            last_publication_date: '06-15-2021'
          }
        ]
      })
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'react-testing-library',
              title: 'React Testing Library',
              excerpt: 'Test your app',
              updatedAt: '15 de junho de 2021'
            }
          ]
        }
      })
    );
  });
});
