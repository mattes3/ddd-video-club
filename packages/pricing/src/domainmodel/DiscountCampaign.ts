export type DiscountCampaign = {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    campaignTitle: string;

    startingFrom: Date;
    validThru: Date;

    movieCategoryName: string;
    percentage: number;
};
