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
        ('@xDepcio/template25', true, 1, 'clojure luminus rocksdb'),
        ('template_1', True, 3, 'gallery dashboard'),
        ('template_2', True, 1, 'gallery ecommerce website admin'),
        ('template_3', True, 2, 'portfolio admin'),
        ('template_4', False, 8, 'admin ecommerce website blog'),
        ('template_5', True, 3, 'landing'),
        ('template_6', True, 3, 'resume blog landing dashboard admin'),
        ('template_7', False, 2, 'website resume admin ecommerce'),
        ('template_8', False, 4, 'resume'),
        ('template_9', False, 9, 'gallery'),
        ('template_10', False, 3, 'admin landing'),
        ('template_11', False, 7, 'dashboard'),
        ('template_12', True, 1, 'resume gallery blog portfolio'),
        ('template_13', False, 7, 'resume dashboard form landing'),
        ('template_14', True, 9, 'website form dashboard admin ecommerce'),
        ('template_15', False, 8, 'resume form dashboard'),
        ('template_16', True, 7, 'gallery admin landing blog'),
        ('template_17', True, 10, 'landing dashboard portfolio'),
        ('template_18', True, 7, 'landing gallery'),
        ('template_19', True, 4, 'website'),
        ('template_20', True, 6, 'resume'),
        ('template_21', False, 9, 'portfolio form resume website blog'),
        ('template_22', False, 10, 'portfolio resume website blog dashboard'),
        ('template_23', False, 8, 'admin gallery portfolio landing dashboard'),
        ('template_24', True, 3, 'dashboard'),
        ('template_25', True, 2, 'ecommerce'),
        ('template_26', True, 4, 'website resume ecommerce landing portfolio'),
        ('template_27', True, 5, 'gallery admin'),
        ('template_28', False, 8, 'resume ecommerce form'),
        ('template_29', False, 1, 'portfolio'),
        ('template_30', False, 5, 'ecommerce admin'),
        ('template_31', True, 10, 'website form'),
        ('template_32', True, 1, 'website form portfolio gallery ecommerce'),
        ('template_33', False, 5, 'resume form'),
        ('template_34', False, 4, 'form blog portfolio dashboard admin'),
        ('template_35', True, 5, 'ecommerce'),
        ('template_36', False, 3, 'gallery resume website'),
        ('template_37', False, 5, 'dashboard'),
        ('template_38', False, 3, 'dashboard gallery portfolio admin'),
        ('template_39', True, 6, 'portfolio'),
        ('template_40', True, 8, 'ecommerce gallery blog website'),
        ('template_41', False, 1, 'dashboard resume landing ecommerce'),
        ('template_42', False, 1, 'gallery'),
        ('template_43', False, 4, 'website form gallery resume'),
        ('template_44', False, 9, 'admin resume portfolio'),
        ('template_45', True, 3, 'dashboard resume landing website'),
        ('template_46', True, 10, 'gallery dashboard form portfolio website'),
        ('template_47', True, 5, 'dashboard ecommerce'),
        ('template_48', False, 1, 'form'),
        ('template_49', False, 2, 'dashboard gallery portfolio landing'),
        ('template_50', False, 10, 'form ecommerce landing website admin')
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
