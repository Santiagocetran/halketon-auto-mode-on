insert into people (display_name, whatsapp_number, role) values
  ('Mateo', '+5491100000001', 'Coordinator'),
  ('Lucia', '+5491100000002', 'Programs'),
  ('Agus', '+5491100000003', 'Operations')
on conflict (whatsapp_number) do nothing;

insert into inbound_messages (sender_phone, sender_name, body, raw_payload) values
  ('+5491100000001', 'Mateo', 'Yo me encargo del informe para el viernes', '{"demo": true}'),
  ('+5491100000002', 'Lucia', 'Lucia coordina sponsors antes del martes', '{"demo": true}'),
  ('+5491100000003', 'Agus', 'Tengo bloqueado el proveedor del salon', '{"demo": true}');

insert into tasks (owner_name, task_title, description, due_date, status, priority, source_type, source_text, confidence)
values
  ('Mateo', 'Preparar informe', 'Informe de avance para direccion.', current_date + interval '2 days', 'pending', 'high', 'whatsapp', 'Yo me encargo del informe para el viernes', 0.94),
  ('Lucia', 'Coordinar sponsors', 'Cerrar lista de sponsors y confirmar contactos.', current_date + interval '5 days', 'in_progress', 'normal', 'whatsapp', 'Lucia coordina sponsors antes del martes', 0.89),
  ('Agus', 'Resolver proveedor del salon', 'Desbloquear confirmacion del proveedor.', current_date - interval '1 day', 'blocked', 'urgent', 'whatsapp', 'Tengo bloqueado el proveedor del salon', 0.81),
  ('Mateo', 'Enviar propuesta', 'Mandar propuesta final del demo.', current_date - interval '3 days', 'pending', 'high', 'meeting', 'Mateo envia propuesta para el jueves', 0.91);

insert into meetings (title, transcript, summary)
values (
  'Demo planning',
  'Mateo envia propuesta para el jueves. Agus coordina proveedor. Lucia revisa dashboard.',
  'Se definieron compromisos para propuesta, proveedor y revision de dashboard.'
);

