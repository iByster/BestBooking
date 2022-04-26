import { Query, Resolver } from 'type-graphql';

@Resolver()
export class ShelterResolver {
  @Query(() => String)
  hello() {
    return 'hello world';
  }
}
