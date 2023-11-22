import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=600');
    let listOfPokemon: CreatePokemonDto[] = [];
    data.results.forEach(({name,url}) => {
      const segments = url.split('/');
      const no = Number(segments[segments.length - 2]);
      const currentPokemon: CreatePokemonDto = {
        no,
        name,
      };
      listOfPokemon.push(currentPokemon);
    });
    await this.pokemonModel.insertMany(listOfPokemon);
    return {'message': 'Seed executed successfully'};
  }
}
