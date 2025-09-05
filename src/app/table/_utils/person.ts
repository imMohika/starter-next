import { faker, type SexType } from "@faker-js/faker";

export interface Person {
  id: string;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  sex: SexType;
  birthDate: Date;
  phoneNumber: string;
  createdAt: Date;
}

export const randomPerson = (): Person => {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  const email = faker.internet.email({ firstName, lastName });

  return {
    id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    email,
    firstName,
    lastName,
    sex,
    birthDate: faker.date.birthdate(),
    phoneNumber: faker.phone.number(),
    createdAt: faker.date.past(),
  };
};
