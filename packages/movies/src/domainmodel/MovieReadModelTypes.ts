// @ReadModel
// @ValueObject
export type MovieSelectionReadModel = {
    id: string;
    title: string;
    description: string;
    posterUrl: string;
    categoryName: string;
};

// @ReadModel
// @ValueObject
export type MovieViewingReadModel = {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    categoryName: string;
};
