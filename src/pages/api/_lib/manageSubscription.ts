import { query } from 'faunadb';

import { fauna } from '../../../services/fauna';
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
): Promise<void> {
  const userRef = await fauna.query(
    query.Select(
      'ref',
      query.Get(query.Match(query.Index('user_by_stripe_customer_id'), customerId))
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const { id, status, items } = subscription;

  const subscriptionData = {
    id: id,
    user: userRef,
    status: status,
    priceId: items.data[0].price.id
  };

  if (createAction) {
    await fauna.query(
      query.Create(query.Collection('subscriptions'), {
        data: subscriptionData
      })
    );
  } else {
    await fauna.query(
      query.Replace(
        query.Select(
          'ref',
          query.Get(query.Match(query.Index('subscription_by_id'), subscriptionId))
        ),
        { data: subscriptionData }
      )
    );
  }
}
