insert into
    storage.buckets (id, name, public)
values ('cms-news', 'cms-news', true),
    (
        'cms-gallery',
        'cms-gallery',
        true
    ),
    (
        'cms-reports',
        'cms-reports',
        true
    ),
    (
        'cms-avatars',
        'cms-avatars',
        true
    )
on conflict (id) do nothing;