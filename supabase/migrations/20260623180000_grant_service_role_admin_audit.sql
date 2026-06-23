-- Grant service_role permission to insert and select from admin_audit_logs
grant insert, select on public.admin_audit_logs to service_role;
