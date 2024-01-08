import { sql } from "@vercel/postgres";

async function createDummyTemplates() {
    await sql`INSERT INTO templates (name, public, owner_id, tags) VALUES
        ('@xDepcio/template1', true, 1, 'nextjs react typescript tailwind'),
        ('@xDepcio/template2', false, 1, 'express sequelize postgres socketio'),
        ('@xDepcio/template3', true, 1, 'python flask sql'),
        ('@xDepcio/template4', false, 1, 'express sql postgres'),
        ('@xDepcio/template5', true, 1, 'vue laravel mysql'),
        ('@xDepcio/template6', true, 1, 'django react postgresql'),
        ('@xDepcio/template7', true, 1, 'spring angular mongodb'),
        ('@xDepcio/template8', true, 1, 'ruby rails sqlite'),
        ('@xDepcio/template9', true, 1, 'nodejs express mongo'),
        ('@xDepcio/template10', true, 1, 'go echo sqlserver'),
        ('@xDepcio/template11', true, 1, 'php symfony mariadb'),
        ('@xDepcio/template12', true, 1, 'java vertx cassandra'),
        ('@xDepcio/template13', true, 1, 'rust actix graphql'),
        ('@xDepcio/template14', true, 1, 'kotlin ktor redis'),
        ('@xDepcio/template15', true, 1, 'elixir phoenix arangodb'),
        ('@xDepcio/template16', true, 1, 'swift vapor dynamodb'),
        ('@xDepcio/template17', true, 1, 'csharp aspnet neo4j'),
        ('@xDepcio/template18', true, 1, 'perl dancer elasticsearch'),
        ('@xDepcio/template19', true, 1, 'c++ cpprestsdk orientdb'),
        ('@xDepcio/template20', true, 1, 'javascript nextjs firebase'),
        ('@xDepcio/template21', true, 1, 'typescript nestjs rethinkdb'),
        ('@xDepcio/template22', true, 1, 'svelte kit couchdb'),
        ('@xDepcio/template23', true, 1, 'fsharp giraffe aerospike'),
        ('@xDepcio/template24', true, 1, 'haskell yesod etcd'),
        ('@xDepcio/template25', true, 1, 'clojure luminus rocksdb')
    ;`
}


async function main() {
    await createDummyTemplates()
}

main().catch((err) => {
    console.error(
        "An error occured when seeding database:",
        err
    )
})
