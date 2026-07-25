-- Run this in the Supabase SQL editor to see which migrations have
-- and have NOT been applied yet. It only reads — nothing is changed.

with checks as (
  select 'schema.sql'                 as migration, to_regclass('public.orders') is not null
                                                      and to_regclass('public.custom_order_requests') is not null as done
  union all
  select 'products-migration.sql',    to_regclass('public.products') is not null
  union all
  select 'popcorn-migration.sql',     exists (
    select 1 from information_schema.columns
    where table_name = 'custom_order_requests' and column_name = 'popcorn_quantity'
  )
  union all
  select 'promo-codes-migration.sql', to_regclass('public.promo_codes') is not null
                                       and to_regclass('public.waitlist') is not null
  union all
  select 'reviews-migration.sql',     to_regclass('public.reviews') is not null
  union all
  select 'growth-migration.sql',      to_regclass('public.referrals') is not null
                                       and exists (
                                         select 1 from information_schema.columns
                                         where table_name = 'orders' and column_name = 'referral_code'
                                       )
  union all
  select 'custom-options-migration.sql', to_regclass('public.custom_config') is not null
                                          and to_regclass('public.custom_options') is not null
  union all
  select 'portfolio-migration.sql',   to_regclass('public.portfolio') is not null
  union all
  select 'custom-groups-migration.sql', to_regclass('public.custom_option_groups') is not null
                                         and exists (
                                           select 1 from information_schema.columns
                                           where table_name = 'custom_options' and column_name = 'description'
                                         )
  union all
  select 'quote-migration.sql',       exists (
    select 1 from information_schema.columns
    where table_name = 'custom_order_requests' and column_name = 'quote_token'
  )
)
select
  migration,
  case when done then '✅ applied' else '❌ NOT applied — run this one' end as status
from checks
order by
  case migration
    when 'schema.sql' then 1
    when 'products-migration.sql' then 2
    when 'popcorn-migration.sql' then 3
    when 'promo-codes-migration.sql' then 4
    when 'reviews-migration.sql' then 5
    when 'growth-migration.sql' then 6
    when 'custom-options-migration.sql' then 7
    when 'portfolio-migration.sql' then 8
    when 'custom-groups-migration.sql' then 9
    when 'quote-migration.sql' then 10
  end;
