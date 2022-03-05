import { expect, should } from "chai";
import { connect, clear, close } from '../../db'
import { newPhotographers } from '../../seed'
import { IPhotographer } from "../../../types/photographer";
import photographerService from '../../../services/photographer'

describe('...', () => {
  before(async () => await connect());
  beforeEach(async () => await clear())
  after(async () => await close());

  //it('should get all photographers', async () => {
    //for (const photographer of newPhotographers) {
      //await photographerService.create(
        //photographer.name,
        //photographer.availabilities,
        //photographer.bookings
      //)
    //}
    //const photographers: IPhotographer[] = await photographerService.get();

    //expect(photographers).to.have.lengthOf(2)
  //});

  it('should get all available photographers', async () => {
    for (const photographer of newPhotographers) {
      await photographerService.create(
        photographer.name,
        photographer.availabilities,
        photographer.bookings
      )
    }
    const photographers: IPhotographer[] = await photographerService.get();

    expect(photographers).to.have.lengthOf(2)
  });

  it('should create photographer', async () => {
    const photographer: IPhotographer = await photographerService.create(
      newPhotographers[0].name,
      newPhotographers[0].availabilities,
      newPhotographers[0].bookings
    );

    should().exist(photographer)
    expect(photographer.name).to.equal('Otto Crawford')
    expect(photographer).to.have.property('availabilities').with.lengthOf(1)
    expect(photographer).to.have.property('bookings').with.lengthOf(1)
  });

  //it('should patch photographer by id', async () => {
    //const photographer: IPhotographer = await photographerService.create(
      //newPhotographers[0].name,
      //newPhotographers[0].availabilities,
      //newPhotographers[0].bookings
    //);

    //should().exist(photographer)
    //expect(photographer.name).to.equal('Otto Crawford')
    //expect(photographer).to.have.property('availabilities').with.lengthOf(1)
    //expect(photographer).to.have.property('bookings').with.lengthOf(1)
  //});

  //it('should delete photographer by id', async () => {
    //const photographer: IPhotographer = await photographerService.create(
      //newPhotographers[0].name,
      //newPhotographers[0].availabilities,
      //newPhotographers[0].bookings
    //);

    //should().exist(photographer)
    //expect(photographer.name).to.equal('Otto Crawford')
    //expect(photographer).to.have.property('availabilities').with.lengthOf(1)
    //expect(photographer).to.have.property('bookings').with.lengthOf(1)
  //});
});
