import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number = this.configService.get('defaultLimit');

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }  
  }

  async findAll({ limit = this.defaultLimit, offset = 0 }: PaginationDto) {
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon
    if( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if( !pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
    }

    if( !pokemon ) 
      throw new NotFoundException(`Pokemon with term ${term} not found`); 
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);
      if(updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...updatePokemonDto, ...pokemon.toJSON()};
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id});
    if( deletedCount === 0 ) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return { deleted: true };
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException(`Internal server error - check the logs`);
  }
}
