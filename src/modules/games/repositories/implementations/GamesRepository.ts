import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private usersRepository: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);
    this.usersRepository = getRepository(User);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder('g')
      .select('g.*')
      .where(`title ilike '%' || :param ||'%'`, { param: param })
      .execute();
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query(
      `select count(*) from games`
    ); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('u')
      .select('u.*')
      .innerJoin('users_games_games', 'ugg', 'ugg.usersId = u.id')
      .where('ugg.gamesId = :id', { id })
      .execute()
    // Complete usando query builder
  }
}
