export interface Character {
  id: string;
  name: string;
  role: string;
  disorder: string;
  description: string;
  imageUrl: string;
  quote: string;
}

export interface Message {
  role: "user" | "model";
  text: string;
}
