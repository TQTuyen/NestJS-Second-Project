describe('Reservations', () => {
  let jwt: string;

  beforeAll(async () => {
    const user = {
      email: 'test@example.com',
      password: 'Test*123*456*$$$',
    };

    await fetch('http:/auth:3001/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    jwt = await response.text();
  });

  test('Create & Get', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const createdReservation = await createReservation();

    const response = await fetch(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `http://reservations:3000/reservations/${createdReservation._id}`,
      {
        headers: {
          authentication: jwt,
        },
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reservation = await response.json();

    expect(createdReservation).toEqual(reservation);
  });

  const createReservation = async () => {
    const newReservation = {
      startDate: '08-02-2025',
      endDate: '08-07-2025',
      charge: {
        card: {
          cvc: '567',
          exp_month: 12,
          exp_year: 2034,
          networks: {},
          number: '4242 4242 4242 4242',
          token: 'tok_visa',
        },
        amount: 100,
      },
    };

    const response = await fetch('http://reservations:3000/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authentication: jwt,
      },
      body: JSON.stringify(newReservation),
    });

    expect(response.ok).toBeTruthy();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response.json();
  };
});
