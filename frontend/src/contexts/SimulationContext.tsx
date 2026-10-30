import React, { createContext, useContext, useState } from 'react';

export interface SimClass {
  id: string;
  title: string;
  time: string;
  duration: string;
  instructor: string;
  occupied: number;
  capacity: number;
  color: string;
  sala: string;
}

export interface SimBooking {
  id: string;
  title: string;
  time: string;
  day: string;
  instructor: string;
  room: string;
  status: 'CONFIRMADO' | 'FILA';
  queuePos?: number;
}

export interface SimReceptionAttendee {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'AGUARDANDO' | 'PRESENTE' | 'FALTA';
}

interface SimulationContextType {
  simUser: 'ana' | 'bruno';
  setSimUser: (u: 'ana' | 'bruno') => void;
  simTime: string;
  classes: SimClass[];
  setClasses: React.Dispatch<React.SetStateAction<SimClass[]>>;
  myBookings: SimBooking[];
  setMyBookings: React.Dispatch<React.SetStateAction<SimBooking[]>>;
  receptionList: SimReceptionAttendee[];
  setReceptionList: React.Dispatch<React.SetStateAction<SimReceptionAttendee[]>>;
  activeModal: string | null;
  setActiveModal: (m: string | null) => void;
  selectedClass: SimClass;
  setSelectedClass: (c: SimClass) => void;
  selectedBookingToCancel: SimBooking | null;
  setSelectedBookingToCancel: (b: SimBooking | null) => void;
  resetSimulation: () => void;
  navigateToScreen: (screenId: string) => void;
}

const initialClasses: SimClass[] = [
  {
    id: 'c-pilates',
    title: 'Pilates Solo',
    time: '14:00',
    duration: '50 min',
    instructor: 'Renata Dias',
    occupied: 9,
    capacity: 15,
    color: 'bg-amber-400',
    sala: 'Sala 1'
  },
  {
    id: 'c-yoga',
    title: 'Yoga Flow',
    time: '19:00',
    duration: '50 min',
    instructor: 'Luísa Ramos',
    occupied: 19,
    capacity: 20,
    color: 'bg-purple-500',
    sala: 'Sala Zen'
  },
  {
    id: 'c-spinning',
    title: 'Spinning Power',
    time: '18:00',
    duration: '45 min',
    instructor: 'Diego Lima',
    occupied: 20,
    capacity: 20,
    color: 'bg-red-500',
    sala: 'Sala de Bike'
  },
  {
    id: 'c-funcional',
    title: 'Funcional 360',
    time: '12:00',
    duration: '45 min',
    instructor: 'Marina Alves',
    occupied: 8,
    capacity: 20,
    color: 'bg-orange-500',
    sala: 'Arena Funcional'
  },
  {
    id: 'c-alongamento',
    title: 'Alongamento & Mobilidade',
    time: '11:59',
    duration: '30 min',
    instructor: 'Paula Torres',
    occupied: 15,
    capacity: 20,
    color: 'bg-emerald-500',
    sala: 'Sala 2'
  },
  {
    id: 'c-hidro',
    title: 'Hidroginástica',
    time: '15:00',
    duration: '45 min',
    instructor: 'Marcos Silva',
    occupied: 12,
    capacity: 20,
    color: 'bg-sky-500',
    sala: 'Piscina Térmica'
  }
];

const initialBookings: SimBooking[] = [
  {
    id: 'b-hidro',
    title: 'Hidroginástica',
    time: '15:00',
    day: 'Hoje, 22 de maio',
    instructor: 'Marcos Silva',
    room: 'Piscina Térmica',
    status: 'CONFIRMADO'
  },
  {
    id: 'b-funcional',
    title: 'Funcional 360',
    time: '12:00',
    day: 'Hoje, 22 de maio',
    instructor: 'Marina Alves',
    room: 'Arena Funcional',
    status: 'CONFIRMADO'
  },
  {
    id: 'b-alongamento',
    title: 'Alongamento & Mobilidade',
    time: '11:59',
    day: 'Hoje, 22 de maio',
    instructor: 'Paula Torres',
    room: 'Sala 2',
    status: 'CONFIRMADO'
  }
];

const initialReception: SimReceptionAttendee[] = [
  { id: 'rec-1', name: 'Ana Souza', email: 'ana@moveplus.com', plan: 'Move One', status: 'AGUARDANDO' },
  { id: 'rec-2', name: 'Carlos Pires', email: 'carlos@moveplus.com', plan: 'Move One', status: 'AGUARDANDO' },
  { id: 'rec-3', name: 'Mariana Duarte', email: 'mariana@email.com', plan: 'Move Prime', status: 'PRESENTE' }
];

const SimulationContext = createContext<SimulationContextType>({} as SimulationContextType);

export const SimulationProvider: React.FC<{
  children: React.ReactNode;
  onNavigateTab: (tab: any) => void;
}> = ({ children, onNavigateTab }) => {
  const [simUser, setSimUser] = useState<'ana' | 'bruno'>('ana');
  const simTime = '10:00';
  const [classes, setClasses] = useState<SimClass[]>(initialClasses);
  const [myBookings, setMyBookings] = useState<SimBooking[]>(initialBookings);
  const [receptionList, setReceptionList] = useState<SimReceptionAttendee[]>(initialReception);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<SimClass>(initialClasses[0]);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState<SimBooking | null>(null);

  const resetSimulation = () => {
    setSimUser('ana');
    setClasses(JSON.parse(JSON.stringify(initialClasses)));
    setMyBookings(JSON.parse(JSON.stringify(initialBookings)));
    setReceptionList(JSON.parse(JSON.stringify(initialReception)));
    setActiveModal(null);
    setSelectedClass(initialClasses[0]);
    setSelectedBookingToCancel(null);
  };

  const navigateToScreen = (screenId: string) => {
    switch (screenId) {
      case 'T01':
        onNavigateTab('minha-agenda');
        setActiveModal(null);
        break;
      case 'T02':
        onNavigateTab('minha-agenda');
        setSelectedClass(classes[0]); // Pilates 14:00
        setActiveModal('T02');
        break;
      case 'T03':
        onNavigateTab('minha-agenda');
        setSelectedClass(classes[0]);
        setActiveModal('T03');
        break;
      case 'T04':
        onNavigateTab('minha-agenda');
        setSelectedClass(classes[0]);
        setActiveModal('T04');
        break;
      case 'T05':
        onNavigateTab('minha-agenda');
        setSimUser('bruno');
        setSelectedClass(classes[0]);
        setActiveModal('T05');
        break;
      case 'T06':
        onNavigateTab('minha-agenda');
        setSelectedClass(classes[2]); // Spinning 18:00 lotada
        setActiveModal('T06');
        break;
      case 'T07':
        onNavigateTab('minha-agenda');
        setActiveModal(null);
        // Scroll para Meus Agendamentos
        setTimeout(() => {
          const el = document.getElementById('secao-meus-agendamentos');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'T08':
        onNavigateTab('minha-agenda');
        setSelectedBookingToCancel(myBookings[0]);
        setActiveModal('T08');
        break;
      case 'T09':
        onNavigateTab('minha-agenda');
        setSelectedBookingToCancel(myBookings[0]);
        setActiveModal('T09');
        break;
      case 'T10':
        onNavigateTab('minha-agenda');
        setSelectedBookingToCancel(myBookings[2]); // Alongamento 11:59 (menos de 2h para 10:00)
        setActiveModal('T10');
        break;
      case 'T11':
        onNavigateTab('painel-gestor');
        setActiveModal('T11');
        break;
      case 'T12':
        onNavigateTab('painel-gestor');
        setActiveModal('T12');
        break;
      default:
        setActiveModal(null);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        simUser,
        setSimUser,
        simTime,
        classes,
        setClasses,
        myBookings,
        setMyBookings,
        receptionList,
        setReceptionList,
        activeModal,
        setActiveModal,
        selectedClass,
        setSelectedClass,
        selectedBookingToCancel,
        setSelectedBookingToCancel,
        resetSimulation,
        navigateToScreen
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => useContext(SimulationContext);
