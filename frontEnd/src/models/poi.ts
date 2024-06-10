export type Poi = {
  id: number;
  lat: number;
  lng: number;
  address: string;
  name: string;
  description: string;
  createdAt: Date;
  updateAt: Date;
};

export type FormPoi = {
  address: string;
  name: string;
  description: string;
  lat?: number;
  lng?: number;
};
