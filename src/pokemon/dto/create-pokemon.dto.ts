import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsInt()
    @Min(1)
    @IsPositive()
    no: number;
}
