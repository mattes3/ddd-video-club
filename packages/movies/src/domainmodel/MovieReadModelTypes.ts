// @ReadModel
export type MovieSelectionReadModel = {
    id: string;
    title: string;
    description: string;
    posterUrl: string;
    publicationDate: Date;
    categoryName: string;
};

// @ReadModel
export type MovieViewingReadModel = {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    publicationDate: Date;
    categoryName: string;
};
