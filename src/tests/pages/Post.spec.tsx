import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post Content</p>',
  updatedAt: '30 de Abril',
};

describe('Post Page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument;
    expect(screen.getByText('Post Content')).toBeInTheDocument;
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false,
        },
      })
    );
  });

  it('loads initial data', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My New Post' }],
          content: [{ type: 'paragraph', text: 'Post Content' }],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post Content</p>',
            updatedAt: '01 de abril de 2021',
          },
        },
      })
    );
  });
});
