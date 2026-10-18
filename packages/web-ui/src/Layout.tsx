import type { Child } from 'hono/jsx';
import { raw } from 'hono/html';

export type NavItemKey = 'select' | 'watch' | 'account';

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const navigation: { key: NavItemKey; name: string; href: string }[] = [
    { key: 'select', name: 'Select movie', href: '/movie-selection' },
    { key: 'watch', name: 'Watch movie', href: '#' },
    { key: 'account', name: 'Your account', href: '/account' },
];

function NavLinks({ active }: { active?: NavItemKey }) {
    return (
        <>
            {navigation.map(item => (
                <a
                    href={item.href}
                    class={item.key === active ? 'nav-link active' : 'nav-link'}
                    aria-current={item.key === active ? 'page' : undefined}
                >
                    {item.name}
                </a>
            ))}
        </>
    );
}

export function Layout(props: { title: string; active?: NavItemKey; children?: Child }) {
    return (
        <>
            {raw('<!doctype html>')}
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>{props.title ? `${props.title} – DDD Video Club` : 'DDD Video Club'}</title>
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="stylesheet" href="/assets/app.css" />
                    <script src="/assets/htmx.min.js" defer></script>
                    <script src="/assets/cally.min.js" type="module"></script>
                    <script src="/assets/app.js" defer></script>
                </head>
                <body>
                    <nav class="topbar">
                        <div class="container topbar-inner">
                            <p class="brand">
                                DDD <span class="brand-video">Video</span>{' '}
                                <span class="brand-club">Club</span>
                            </p>
                            <div class="nav-links">
                                <NavLinks active={props.active} />
                            </div>
                            <img class="avatar" src={user.imageUrl} alt={user.name} title={user.name} />
                            <details class="nav-mobile">
                                <summary aria-label="Open main menu">☰</summary>
                                <div class="nav-mobile-panel">
                                    <NavLinks active={props.active} />
                                    <div class="nav-mobile-user">
                                        <img class="avatar" src={user.imageUrl} alt="" />
                                        <div>
                                            <div class="user-name">{user.name}</div>
                                            <div class="user-email">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </nav>

                    <div class="page">
                        <header class="container">
                            <h1>{props.title}</h1>
                        </header>
                        <main class="container">{props.children}</main>
                    </div>

                    <div id="dialog-slot"></div>
                </body>
            </html>
        </>
    );
}
