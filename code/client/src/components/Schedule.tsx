import { useState } from 'react';
import { Studio, Workshop } from '@/sharedTypes';
import { calendarCss } from '@/constants';
import {
  Calendar,
  Components,
  EventProps,
  momentLocalizer,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { css, Global } from '@emotion/react';
import { Button } from '@/components/ui/Button';
import {
  CalendarPlus as PlusIcon,
  ArrowUpFromLine as QuickSetupIcon,
} from 'lucide-react';
import WorkshopDayEvent from './WorkshopDayEvent';
import WorkshopAgendaEvent from './WorkshopAgendaEvent';
import { LoaderPage, Modal } from './ui';
import WorkshopForm from './WorkshopForm';
import { useUserContext } from '@/contexts/UserData';
import { useTeamData } from '@/contexts/TeamData';
import { useWorkshopData } from '@/contexts/WorkshopData';

moment.locale('en-GB');

const Schedule = () => {
  const {
    workshops,
    isLoading: workshopsLoading,
    createSampleWorkshops,
  } = useWorkshopData();
  const [formOpen, setFormOpen] = useState(false);
  const { isChargesEnabled } = useUserContext();
  const { studios, isLoading: teamLoading } = useTeamData();
  const [error, setError] = useState<any>(null);

  if ((workshopsLoading || teamLoading) && !formOpen) {
    return <LoaderPage />;
  }

  const components: Components<Workshop, Studio> = {
    event: ({ event }: { event: Workshop }) => {
      return <WorkshopDayEvent event={event} />;
    },
    agenda: {
      event: ({ event }: EventProps<Workshop>) => {
        return <WorkshopAgendaEvent {...event} />;
      },
    },
  };

  const handleCreateSampleWorkshops = async () => {
    try {
      await createSampleWorkshops();
    } catch (error: any) {
      setError(error.message || 'Failed to create sample workshops');
      console.error('Error creating sample workshops:', error);
    }
  };

  return (
    <>
      <Global
        styles={css`
          ${calendarCss}
        `}
      />
      {error && (
        <div className="mb-3 flex justify-center rounded-md bg-red-100 p-2 text-red-500">
          {error}
        </div>
      )}
      <div className="mb-3 flex gap-3">
        <h1 className="flex-1 text-3xl font-bold">Workshops</h1>
        <Button
          onClick={handleCreateSampleWorkshops}
          className="gap-2 bg-white text-base font-medium text-primary shadow transition hover:shadow-md"
          disabled={workshopsLoading || !isChargesEnabled}
        >
          <QuickSetupIcon className="h-5 w-5"></QuickSetupIcon>
          Quick Setup
        </Button>
        <Button
          onClick={() => {
            setFormOpen(true);
          }}
          className="gap-2 bg-[#312356] text-base font-bold shadow transition hover:shadow-md"
          disabled={workshopsLoading || !isChargesEnabled}
        >
          <PlusIcon className="h-5 w-5"></PlusIcon>
          Create Class
        </Button>
      </div>
      <Calendar
        components={components}
        events={workshops}
        defaultView={'agenda'}
        views={['day', 'agenda']}
        resources={studios}
        titleAccessor={(event) => event.name}
        startAccessor={(event) => new Date(event.start)}
        endAccessor={(event) => new Date(event.end)}
        resourceAccessor={(event) => event.studioId}
        resourceTitleAccessor={(resource) => resource.name}
        resourceIdAccessor={(resource) => resource.id}
        defaultDate={new Date()}
        max={moment().hours(18).minutes(0).seconds(0).toDate()}
        min={moment().hours(9).minutes(0).seconds(0).toDate()}
        step={60}
        timeslots={1}
        localizer={momentLocalizer(moment)}
        style={{
          minHeight: `800px`,
          overflow: 'auto',
          height: 'auto',
        }}
      />
      <Modal
        title="Create Workshop"
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
      >
        <WorkshopForm setOpen={setFormOpen} />
      </Modal>
    </>
  );
};

export default Schedule;
