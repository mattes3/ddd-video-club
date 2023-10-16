import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

import type { AccountOverviewReadModel } from '@ddd-video-club-v2/accounting';

import { Master } from './Master';

const DISPLAY_LOCALE = 'en-US';
const ACCOUNT_QUERY = ['my-account', { time: new Date().toISOString() }];

export const MyAccount: React.FC = () => {
    function currency(num: number) {
        return Math.floor(num / 100).toLocaleString(DISPLAY_LOCALE, {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    const { isLoading, data: accountOverview } = useQuery(ACCOUNT_QUERY, async () =>
        axios.get<AccountOverviewReadModel>(`/api/accounts/myaccount`).then(({ data }) => data),
    );

    return (
        <Master title="Your Account">
            {!isLoading && accountOverview && (
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Date</th>
                            <th style={{ textAlign: 'left' }}>Title</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountOverview.entries.map((entry, index) => (
                            <tr key={index}>
                                <td className="text-left">
                                    {new Date(entry.createdAt).toLocaleDateString(DISPLAY_LOCALE, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </td>
                                <td className="text-left">{entry.title}</td>
                                <td className="text-right">{currency(entry.amount)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td />
                            <td />
                            <td className="text-left font-bold">
                                Account balance: {currency(accountOverview.balance)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </Master>
    );
};
