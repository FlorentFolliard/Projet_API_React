export type Player = {
    id: number;
    name: string;
    dateOfBirth: string;
    nationality: string;
    position: string;
    shirtNumber: number;
    currentTeam: {
        id: number;
        name: string;
        crest: string;
    };
};