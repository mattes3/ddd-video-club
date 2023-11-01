import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Dialog } from '@headlessui/react';

import 'react-calendar/dist/Calendar.css';

export interface MovieRentalDialogProps {
    title: string;
    open: boolean;
    onClose: Function;
    onMovieRental: (rentalEndDate: Date) => void;
}

export const MovieRentalDialog: React.FC<MovieRentalDialogProps> = (props) => {
    const [rentalEndDate, setRentalEndDate] = useState(new Date());

    function handleClose() {
        props.onClose();
    }

    return (
        <Dialog open={props.open} onClose={handleClose} className="relative z-50">
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            {/* Full-screen container to center the panel */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                {/* The actual dialog panel  */}
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title className="text-lg text-center font-medium leading-6 text-gray-900">{`Watch "${props.title}"`}</Dialog.Title>
                    <div className="flex flex-col items-center">
                        <p className="py-8">Until when do you want to rent this movie?</p>
                        <Calendar onChange={setRentalEndDate} value={rentalEndDate} />
                    </div>
                    <div className="flex justify-center mt-8 space-x-4">
                        <button
                            className="btn-primary-outline"
                            onClick={() => setTimeout(handleClose, 50)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-primary"
                            onClick={() => props.onMovieRental(rentalEndDate)}
                        >
                            Rent now
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
