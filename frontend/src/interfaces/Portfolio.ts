export interface Portfolio {
    id: number;
    name: string;
    quantity: number;
    price?: number;
    created_at?: Date;
    updated_at?: Date;
  }