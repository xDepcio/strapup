import { sql } from "@vercel/postgres";

async function createDummyTemplates() {
    await sql`INSERT INTO templates (id, name, public, owner_id, tags) VALUES
        (1, '@xDepcio/template1', true, 1, 'nextjs react typescript tailwind'),
        (2, '@xDepcio/template2', false, 1, 'express sequelize postgres socketio'),
        (3, '@xDepcio/template3', true, 1, 'python flask sql'),
        (4, '@xDepcio/template4', false, 1, 'express sql postgres'),
        (5, '@xDepcio/template5', true, 1, 'vue laravel mysql'),
        (6, '@xDepcio/template6', true, 1, 'django react postgresql'),
        (7, '@xDepcio/template7', true, 1, 'spring angular mongodb'),
        (8, '@xDepcio/template8', true, 1, 'ruby rails sqlite'),
        (9, '@xDepcio/template9', true, 1, 'nodejs express mongo'),
        (10, '@xDepcio/template10', true, 1, 'go echo sqlserver'),
        (11, '@xDepcio/template11', true, 1, 'php symfony mariadb'),
        (12, '@xDepcio/template12', true, 1, 'java vertx cassandra'),
        (13, '@xDepcio/template13', true, 1, 'rust actix graphql'),
        (14, '@xDepcio/template14', true, 1, 'kotlin ktor redis'),
        (15, '@xDepcio/template15', true, 1, 'elixir phoenix arangodb'),
        (16, '@xDepcio/template16', true, 1, 'swift vapor dynamodb'),
        (17, '@xDepcio/template17', true, 1, 'csharp aspnet neo4j'),
        (18, '@xDepcio/template18', true, 1, 'perl dancer elasticsearch'),
        (19, '@xDepcio/template19', true, 1, 'c++ cpprestsdk orientdb'),
        (20, '@xDepcio/template20', true, 1, 'javascript nextjs firebase'),
        (21, '@xDepcio/template21', true, 1, 'typescript nestjs rethinkdb'),
        (22, '@xDepcio/template22', true, 1, 'svelte kit couchdb'),
        (23, '@xDepcio/template23', true, 1, 'fsharp giraffe aerospike'),
        (24, '@xDepcio/template24', true, 1, 'haskell yesod etcd'),
        (25, '@xDepcio/template25', true, 1, 'clojure luminus rocksdb'),
        (26, 'template_1', True, 3, 'gallery dashboard'),
        (27, 'template_2', True, 1, 'gallery ecommerce website admin'),
        (28, 'template_3', True, 2, 'portfolio admin'),
        (29, 'template_4', False, 8, 'admin ecommerce website blog'),
        (30, 'template_5', True, 3, 'landing'),
        (31, 'template_6', True, 3, 'resume blog landing dashboard admin'),
        (32, 'template_7', False, 2, 'website resume admin ecommerce'),
        (33, 'template_8', False, 4, 'resume'),
        (34, 'template_9', False, 9, 'gallery'),
        (35, 'template_10', False, 3, 'admin landing'),
        (36, 'template_11', False, 7, 'dashboard'),
        (37, 'template_12', True, 1, 'resume gallery blog portfolio'),
        (38, 'template_13', False, 7, 'resume dashboard form landing'),
        (39, 'template_14', True, 9, 'website form dashboard admin ecommerce'),
        (40, 'template_15', False, 8, 'resume form dashboard'),
        (41, 'template_16', True, 7, 'gallery admin landing blog'),
        (42, 'template_17', True, 10, 'landing dashboard portfolio'),
        (43, 'template_18', True, 7, 'landing gallery'),
        (44, 'template_19', True, 4, 'website'),
        (45, 'template_20', True, 6, 'resume'),
        (46, 'template_21', False, 9, 'portfolio form resume website blog'),
        (47, 'template_22', False, 10, 'portfolio resume website blog dashboard'),
        (48, 'template_23', False, 8, 'admin gallery portfolio landing dashboard'),
        (49, 'template_24', True, 3, 'dashboard'),
        (50, 'template_25', True, 2, 'ecommerce'),
        (51, 'template_26', True, 4, 'website resume ecommerce landing portfolio'),
        (52, 'template_27', True, 5, 'gallery admin'),
        (53, 'template_28', False, 8, 'resume ecommerce form'),
        (54, 'template_29', False, 1, 'portfolio'),
        (55, 'template_30', False, 5, 'ecommerce admin'),
        (56, 'template_31', True, 10, 'website form'),
        (57, 'template_32', True, 1, 'website form portfolio gallery ecommerce'),
        (58, 'template_33', False, 5, 'resume form'),
        (59, 'template_34', False, 4, 'form blog portfolio dashboard admin'),
        (60, 'template_35', True, 5, 'ecommerce'),
        (61, 'template_36', False, 3, 'gallery resume website'),
        (62, 'template_37', False, 5, 'dashboard'),
        (63, 'template_38', False, 3, 'dashboard gallery portfolio admin'),
        (64, 'template_39', True, 6, 'portfolio'),
        (65, 'template_40', True, 8, 'ecommerce gallery blog website'),
        (66, 'template_41', False, 1, 'dashboard resume landing ecommerce'),
        (67, 'template_42', False, 1, 'gallery'),
        (68, 'template_43', False, 4, 'website form gallery resume'),
        (69, 'template_44', False, 9, 'admin resume portfolio'),
        (70, 'template_45', True, 3, 'dashboard resume landing website'),
        (71, 'template_46', True, 10, 'gallery dashboard form portfolio website'),
        (72, 'template_47', True, 5, 'dashboard ecommerce'),
        (73, 'template_48', False, 1, 'form'),
        (74, 'template_49', False, 2, 'dashboard gallery portfolio landing'),
        (75, 'template_50', False, 10, 'form ecommerce landing website admin')
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
