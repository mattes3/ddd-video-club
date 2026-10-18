import { CURRENT_CUSTOMER_ID, Layout, nocache } from '@ddd-video-club-v2/web-ui';
import { Hono } from 'hono';

import type { AccountAppService } from '../../domainmodel/AccountAppService';

// HTML pages of the accounting context: the account overview
export function pages(appService: AccountAppService) {
    const r = new Hono();

    r.use(nocache());

    r.get('/', async c => {
        const account = await appService.accountOverviewForCustomer(CURRENT_CUSTOMER_ID);

        return c.html(
            <Layout title="Your Account" active="account">
                {account ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th class="amount">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {account.entries.map(entry => (
                                <tr>
                                    <td>{formatDate(entry.createdAt)}</td>
                                    <td>{entry.title}</td>
                                    <td class="amount">{currency(entry.amount)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                <td></td>
                                <td class="amount balance">
                                    Account balance: {currency(account.balance)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <p class="empty-state">
                        You have no account yet. It will be opened when you{' '}
                        <a href="/movie-selection">rent your first movie</a>.
                    </p>
                )}
            </Layout>,
        );
    });

    return r;
}

function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// amounts are stored in cents
function currency(cents: number): string {
    return (cents / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
