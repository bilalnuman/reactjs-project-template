export type RCSC_Country = { id: number; name: string; hasStates?: boolean };
export type RCSC_State = { id: number; name: string; hasCities?: boolean };
export type RCSC_City = { id: number; name: string };

export type MixedItem =
    | { key: string; label: string; type: "select"; value: string; description?: string }
    | { key: string; label: string; type: "link"; href: string; description?: string; target?: string };

export type InfiniteOption = { key: string; label: string };


export type FormValues = {
  fullName: string;
  email: string;
  password: string;
  role: string;
  terms: boolean;
};