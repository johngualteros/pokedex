import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from 'src/pokemon/entities/pokemon.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    PokemonModule,
    CommonModule
  ]
})
export class SeedModule {}
