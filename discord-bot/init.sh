#initial database configuration. user, password, host, etc -> set default using ENV variable in docker-compose
psql -c "CREATE TABLE IF NOT EXISTS public.event (id bigserial NOT NULL,event_name character varying,event_desc character varying,event_start date,event_stop date,organiser_id bigserial,PRIMARY KEY (id));"
psql -c "CREATE TABLE IF NOT EXISTS public.organiser (id bigserial NOT NULL,organiser_name character varying,organiser_discord character varying,organiser_reputation integer,PRIMARY KEY (id));"
# #create relationship
psql -c "ALTER TABLE public.event DROP CONSTRAINT IF EXISTS fk_organiser;"  
psql -c "ALTER TABLE public.event ADD CONSTRAINT fk_organiser FOREIGN KEY (organiser_id) REFERENCES public.organiser (id) MATCH SIMPLE;"
# #create index
psql -c "CREATE INDEX IF NOT EXISTS fki_fk_organiser ON public.event(organiser_id);"