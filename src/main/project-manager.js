/**
 * MineAI IDE - Project Manager
 * Handles creation, management, and building of Minecraft mod projects
 * Supports Forge, Fabric, Spigot, Datapacks, and more
 */

import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { app } from 'electron';
import AdmZip from 'adm-zip';
import { createGitManager } from './integrations/git-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Project Types Configuration
 */
const PROJECT_TYPES = {
  forge: {
    name: 'Forge Mod',
    description: 'Create mods using Minecraft Forge',
    versions: ['1.20.4', '1.20.1', '1.19.4', '1.19.2', '1.18.2', '1.16.5', '1.12.2'],
    buildTool: 'gradle',
    language: 'java'
  },
  fabric: {
    name: 'Fabric Mod',
    description: 'Create mods using Fabric Loader',
    versions: ['1.20.4', '1.20.1', '1.19.4', '1.19.2', '1.18.2', '1.17.1', '1.16.5'],
    buildTool: 'gradle',
    language: 'java'
  },
  neoforge: {
    name: 'NeoForge Mod',
    description: 'Create mods using NeoForge (modern Forge fork)',
    versions: ['1.21', '1.20.4', '1.20.1'],
    buildTool: 'gradle',
    language: 'java'
  },
  quilt: {
    name: 'Quilt Mod',
    description: 'Create mods using Quilt Loader',
    versions: ['1.20.4', '1.20.1', '1.19.4', '1.18.2'],
    buildTool: 'gradle',
    language: 'java'
  },
  spigot: {
    name: 'Spigot Plugin',
    description: 'Create plugins for Spigot/Paper servers',
    versions: ['1.20.4', '1.20.1', '1.19.4', '1.18.2', '1.16.5', '1.12.2', '1.8.8'],
    buildTool: 'maven',
    language: 'java'
  },
  paper: {
    name: 'Paper Plugin',
    description: 'Create plugins for Paper servers with modern API',
    versions: ['1.20.4', '1.20.1', '1.19.4'],
    buildTool: 'gradle',
    language: 'java'
  },
  velocity: {
    name: 'Velocity Plugin',
    description: 'Create plugins for Velocity proxy',
    versions: ['3.2', '3.1', '3.0'],
    buildTool: 'gradle',
    language: 'java'
  },
  datapack: {
    name: 'Datapack',
    description: 'Create vanilla datapacks with functions and recipes',
    versions: ['1.20.4', '1.20.1', '1.19.4', '1.18.2', '1.17.1', '1.16.5', '1.13'],
    buildTool: 'none',
    language: 'mcfunction'
  },
  resourcepack: {
    name: 'Resource Pack',
    description: 'Create texture and resource packs',
    versions: ['1.20.4', '1.20.1', '1.19.4', '1.18.2', '1.16.5'],
    buildTool: 'none',
    language: 'json'
  },
  modpack: {
    name: 'Modpack',
    description: 'Create curated modpack collections',
    versions: ['1.20.4', '1.20.1', '1.19.2', '1.18.2', '1.16.5', '1.12.2'],
    buildTool: 'none',
    language: 'json'
  }
};

/**
 * Project Manager Class
 */
export class ProjectManager {
  constructor() {
    this.projectsDir = path.join(app.getPath('documents'), 'MineAI Projects');
    this.templatesDir = path.join(__dirname, '../../templates');
  }

  /**
   * Initialize project manager
   */
  async init() {
    // Ensure projects directory exists
    await fs.mkdir(this.projectsDir, { recursive: true });
    
    // Ensure templates directory exists
    await fs.mkdir(this.templatesDir, { recursive: true });
  }

  /**
   * Get available project types
   */
  getProjectTypes() {
    return PROJECT_TYPES;
  }

  /**
   * Get available versions for a project type
   */
  getVersions(projectType) {
    return PROJECT_TYPES[projectType]?.versions || [];
  }

  /**
   * Create a new project
   */
  async createProject(options) {
    const {
      name,
      type,
      mcVersion,
      modId,
      author,
      description,
      location,
      initGit = true,
      features = []
    } = options;

    // Validate inputs
    if (!name || !type || !mcVersion) {
      throw new Error('Name, type, and Minecraft version are required');
    }

    if (!PROJECT_TYPES[type]) {
      throw new Error(`Unknown project type: ${type}`);
    }

    // Generate mod ID if not provided
    const safeModId = modId || name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Determine project path
    const projectPath = location || path.join(this.projectsDir, name);

    // Check if directory exists
    try {
      await fs.access(projectPath);
      throw new Error(`Project directory already exists: ${projectPath}`);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    // Create project directory
    await fs.mkdir(projectPath, { recursive: true });

    // Generate project based on type
    switch (type) {
      case 'forge':
        await this.createForgeProject(projectPath, { name, modId: safeModId, mcVersion, author, description, features });
        break;
      case 'fabric':
        await this.createFabricProject(projectPath, { name, modId: safeModId, mcVersion, author, description, features });
        break;
      case 'spigot':
      case 'paper':
        await this.createPluginProject(projectPath, { name, modId: safeModId, mcVersion, author, description, type, features });
        break;
      case 'datapack':
        await this.createDatapackProject(projectPath, { name, modId: safeModId, mcVersion, author, description });
        break;
      case 'resourcepack':
        await this.createResourcePackProject(projectPath, { name, mcVersion, author, description });
        break;
      default:
        await this.createGenericProject(projectPath, { name, type, mcVersion, author, description });
    }

    // Create MineAI project config
    await this.createProjectConfig(projectPath, {
      name,
      type,
      modId: safeModId,
      mcVersion,
      author,
      description,
      features,
      createdAt: new Date().toISOString()
    });

    // Initialize Git if requested
    if (initGit) {
      const git = createGitManager(projectPath);
      await git.init();
    }

    return {
      success: true,
      projectPath,
      name,
      type,
      mcVersion,
      modId: safeModId
    };
  }

  /**
   * Create MineAI project configuration file
   */
  async createProjectConfig(projectPath, config) {
    const configPath = path.join(projectPath, 'mineai.config.json');
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
  }

  /**
   * Create Forge mod project
   */
  async createForgeProject(projectPath, options) {
    const { name, modId, mcVersion, author, description, features } = options;

    // Create directory structure
    const dirs = [
      'src/main/java',
      'src/main/resources',
      'src/main/resources/assets/' + modId,
      'src/main/resources/assets/' + modId + '/textures',
      'src/main/resources/assets/' + modId + '/textures/item',
      'src/main/resources/assets/' + modId + '/textures/block',
      'src/main/resources/assets/' + modId + '/models',
      'src/main/resources/assets/' + modId + '/models/item',
      'src/main/resources/assets/' + modId + '/models/block',
      'src/main/resources/assets/' + modId + '/lang',
      'src/main/resources/data/' + modId,
      'src/main/resources/data/' + modId + '/recipes',
      'src/main/resources/data/' + modId + '/loot_tables',
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(projectPath, dir), { recursive: true });
    }

    // Create build.gradle
    const buildGradle = this.generateForgeBuildGradle(modId, mcVersion);
    await fs.writeFile(path.join(projectPath, 'build.gradle'), buildGradle, 'utf8');

    // Create settings.gradle
    await fs.writeFile(path.join(projectPath, 'settings.gradle'), `pluginManagement {
    repositories {
        gradlePluginPortal()
        maven { url = 'https://maven.minecraftforge.net/' }
    }
}
rootProject.name = '${modId}'
`, 'utf8');

    // Create mods.toml
    const modsToml = `modLoader="javafml"
loaderVersion="[47,)"
license="MIT"

[[mods]]
modId="${modId}"
version="\${file.jarVersion}"
displayName="${name}"
authors="${author || 'MineAI User'}"
description='''
${description || 'A Minecraft mod created with MineAI IDE'}
'''
`;
    await fs.writeFile(path.join(projectPath, 'src/main/resources/META-INF/mods.toml'), modsToml, 'utf8');
    await fs.mkdir(path.join(projectPath, 'src/main/resources/META-INF'), { recursive: true });
    await fs.writeFile(path.join(projectPath, 'src/main/resources/META-INF/mods.toml'), modsToml, 'utf8');

    // Create main mod class
    const packagePath = `com/${author?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mineai'}/${modId}`;
    await fs.mkdir(path.join(projectPath, 'src/main/java', packagePath), { recursive: true });
    
    const mainClass = this.generateForgeMainClass(modId, packagePath.replace(/\//g, '.'), name);
    await fs.writeFile(path.join(projectPath, 'src/main/java', packagePath, `${this.toPascalCase(modId)}.java`), mainClass, 'utf8');

    // Create lang file
    const langFile = {
      [`itemGroup.${modId}`]: name
    };
    await fs.writeFile(
      path.join(projectPath, `src/main/resources/assets/${modId}/lang/en_us.json`),
      JSON.stringify(langFile, null, 2),
      'utf8'
    );
  }

  /**
   * Create Fabric mod project
   */
  async createFabricProject(projectPath, options) {
    const { name, modId, mcVersion, author, description } = options;

    // Create directory structure
    const dirs = [
      'src/main/java',
      'src/main/resources',
      'src/main/resources/assets/' + modId,
      'src/main/resources/assets/' + modId + '/textures',
      'src/main/resources/assets/' + modId + '/models',
      'src/main/resources/assets/' + modId + '/lang',
      'src/main/resources/data/' + modId,
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(projectPath, dir), { recursive: true });
    }

    // Create build.gradle
    const buildGradle = this.generateFabricBuildGradle(modId, mcVersion);
    await fs.writeFile(path.join(projectPath, 'build.gradle'), buildGradle, 'utf8');

    // Create fabric.mod.json
    const fabricModJson = {
      schemaVersion: 1,
      id: modId,
      version: '${version}',
      name: name,
      description: description || 'A Minecraft mod created with MineAI IDE',
      authors: [author || 'MineAI User'],
      contact: {},
      license: 'MIT',
      environment: '*',
      entrypoints: {
        main: [`com.${(author || 'mineai').toLowerCase().replace(/[^a-z0-9]/g, '')}.${modId}.${this.toPascalCase(modId)}`]
      },
      depends: {
        fabricloader: '>=0.14.0',
        fabric: '*',
        minecraft: mcVersion.startsWith('1.') ? `~${mcVersion}` : mcVersion
      }
    };
    await fs.writeFile(
      path.join(projectPath, 'src/main/resources/fabric.mod.json'),
      JSON.stringify(fabricModJson, null, 2),
      'utf8'
    );

    // Create main mod class
    const packagePath = `com/${(author || 'mineai').toLowerCase().replace(/[^a-z0-9]/g, '')}/${modId}`;
    await fs.mkdir(path.join(projectPath, 'src/main/java', packagePath), { recursive: true });
    
    const mainClass = this.generateFabricMainClass(modId, packagePath.replace(/\//g, '.'), name);
    await fs.writeFile(
      path.join(projectPath, 'src/main/java', packagePath, `${this.toPascalCase(modId)}.java`),
      mainClass,
      'utf8'
    );
  }

  /**
   * Create Spigot/Paper plugin project
   */
  async createPluginProject(projectPath, options) {
    const { name, modId, mcVersion, author, description, type } = options;

    // Create directory structure
    const dirs = [
      'src/main/java',
      'src/main/resources',
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(projectPath, dir), { recursive: true });
    }

    // Create pom.xml for Maven
    const pomXml = this.generatePluginPom(modId, mcVersion, name, author, type);
    await fs.writeFile(path.join(projectPath, 'pom.xml'), pomXml, 'utf8');

    // Create plugin.yml
    const pluginYml = `name: ${name}
version: 1.0.0
main: com.${(author || 'mineai').toLowerCase().replace(/[^a-z0-9]/g, '')}.${modId}.${this.toPascalCase(modId)}
api-version: ${mcVersion.split('.').slice(0, 2).join('.')}
author: ${author || 'MineAI User'}
description: ${description || 'A Minecraft plugin created with MineAI IDE'}
`;
    await fs.writeFile(path.join(projectPath, 'src/main/resources/plugin.yml'), pluginYml, 'utf8');

    // Create main plugin class
    const packagePath = `com/${(author || 'mineai').toLowerCase().replace(/[^a-z0-9]/g, '')}/${modId}`;
    await fs.mkdir(path.join(projectPath, 'src/main/java', packagePath), { recursive: true });
    
    const mainClass = this.generatePluginMainClass(modId, packagePath.replace(/\//g, '.'), name);
    await fs.writeFile(
      path.join(projectPath, 'src/main/java', packagePath, `${this.toPascalCase(modId)}.java`),
      mainClass,
      'utf8'
    );
  }

  /**
   * Create Datapack project
   */
  async createDatapackProject(projectPath, options) {
    const { name, modId, mcVersion, author, description } = options;

    // Determine pack format based on version
    const packFormat = this.getDatapackFormat(mcVersion);

    // Create directory structure
    const dirs = [
      `data/${modId}/functions`,
      `data/${modId}/recipes`,
      `data/${modId}/loot_tables`,
      `data/${modId}/tags/blocks`,
      `data/${modId}/tags/items`,
      'data/minecraft/tags/functions',
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(projectPath, dir), { recursive: true });
    }

    // Create pack.mcmeta
    const packMcmeta = {
      pack: {
        pack_format: packFormat,
        description: description || `${name} - Created with MineAI IDE`
      }
    };
    await fs.writeFile(path.join(projectPath, 'pack.mcmeta'), JSON.stringify(packMcmeta, null, 2), 'utf8');

    // Create load.mcfunction
    await fs.writeFile(
      path.join(projectPath, `data/${modId}/functions/load.mcfunction`),
      `# ${name} - Load function\n# Created with MineAI IDE\ntellraw @a {"text":"${name} loaded!","color":"green"}\n`,
      'utf8'
    );

    // Create tick.mcfunction
    await fs.writeFile(
      path.join(projectPath, `data/${modId}/functions/tick.mcfunction`),
      `# ${name} - Tick function\n# Runs every tick\n`,
      'utf8'
    );

    // Register functions
    await fs.writeFile(
      path.join(projectPath, 'data/minecraft/tags/functions/load.json'),
      JSON.stringify({ values: [`${modId}:load`] }, null, 2),
      'utf8'
    );

    await fs.writeFile(
      path.join(projectPath, 'data/minecraft/tags/functions/tick.json'),
      JSON.stringify({ values: [`${modId}:tick`] }, null, 2),
      'utf8'
    );
  }

  /**
   * Create Resource Pack project
   */
  async createResourcePackProject(projectPath, options) {
    const { name, mcVersion, author, description } = options;

    const packFormat = this.getResourcePackFormat(mcVersion);

    // Create directory structure
    const dirs = [
      'assets/minecraft/textures/block',
      'assets/minecraft/textures/item',
      'assets/minecraft/textures/entity',
      'assets/minecraft/models/block',
      'assets/minecraft/models/item',
      'assets/minecraft/lang',
      'assets/minecraft/sounds',
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(projectPath, dir), { recursive: true });
    }

    // Create pack.mcmeta
    const packMcmeta = {
      pack: {
        pack_format: packFormat,
        description: description || `${name} - Created with MineAI IDE`
      }
    };
    await fs.writeFile(path.join(projectPath, 'pack.mcmeta'), JSON.stringify(packMcmeta, null, 2), 'utf8');
  }

  /**
   * Create generic project
   */
  async createGenericProject(projectPath, options) {
    const { name, type, mcVersion, author, description } = options;

    // Create basic structure
    await fs.mkdir(path.join(projectPath, 'src'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'resources'), { recursive: true });

    // Create README
    const readme = `# ${name}

${description || 'A Minecraft project created with MineAI IDE'}

## Project Type
${PROJECT_TYPES[type]?.name || type}

## Minecraft Version
${mcVersion}

## Author
${author || 'MineAI User'}

## Created with
MineAI IDE - AI-Powered Minecraft Development
`;
    await fs.writeFile(path.join(projectPath, 'README.md'), readme, 'utf8');
  }

  /**
   * Generate Forge build.gradle
   */
  generateForgeBuildGradle(modId, mcVersion) {
    return `plugins {
    id 'net.minecraftforge.gradle' version '[6.0,6.2)'
}

version = '1.0.0'
group = 'com.mineai.${modId}'

java {
    toolchain.languageVersion = JavaLanguageVersion.of(17)
}

minecraft {
    mappings channel: 'official', version: '${mcVersion}'
    
    runs {
        client {
            workingDirectory project.file('run')
            property 'forge.logging.markers', 'REGISTRIES'
            property 'forge.logging.console.level', 'debug'
        }
        server {
            workingDirectory project.file('run')
            property 'forge.logging.markers', 'REGISTRIES'
            property 'forge.logging.console.level', 'debug'
        }
    }
}

dependencies {
    minecraft 'net.minecraftforge:forge:${mcVersion}-47.2.0'
}

jar {
    manifest {
        attributes([
            "Specification-Title"     : "${modId}",
            "Specification-Version"   : "1",
            "Implementation-Title"    : project.name,
            "Implementation-Version"  : project.jar.archiveVersion
        ])
    }
}
`;
  }

  /**
   * Generate Fabric build.gradle
   */
  generateFabricBuildGradle(modId, mcVersion) {
    return `plugins {
    id 'fabric-loom' version '1.4-SNAPSHOT'
    id 'maven-publish'
}

version = project.mod_version
group = project.maven_group

repositories {
}

dependencies {
    minecraft "com.mojang:minecraft:\${project.minecraft_version}"
    mappings "net.fabricmc:yarn:\${project.yarn_mappings}:v2"
    modImplementation "net.fabricmc:fabric-loader:\${project.loader_version}"
    modImplementation "net.fabricmc.fabric-api:fabric-api:\${project.fabric_version}"
}

processResources {
    inputs.property "version", project.version
    filteringCharset "UTF-8"

    filesMatching("fabric.mod.json") {
        expand "version": project.version
    }
}

java {
    withSourcesJar()
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

jar {
    from("LICENSE") {
        rename { "\${it}_\${project.archivesBaseName}"}
    }
}
`;
  }

  /**
   * Generate Plugin pom.xml
   */
  generatePluginPom(modId, mcVersion, name, author, type) {
    const apiVersion = mcVersion.split('.').slice(0, 2).join('.');
    const repo = type === 'paper' 
      ? '<repository><id>papermc</id><url>https://repo.papermc.io/repository/maven-public/</url></repository>'
      : '<repository><id>spigot-repo</id><url>https://hub.spigotmc.org/nexus/content/repositories/snapshots/</url></repository>';
    
    const dependency = type === 'paper'
      ? `<dependency><groupId>io.papermc.paper</groupId><artifactId>paper-api</artifactId><version>${mcVersion}-R0.1-SNAPSHOT</version><scope>provided</scope></dependency>`
      : `<dependency><groupId>org.spigotmc</groupId><artifactId>spigot-api</artifactId><version>${mcVersion}-R0.1-SNAPSHOT</version><scope>provided</scope></dependency>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.${(author || 'mineai').toLowerCase().replace(/[^a-z0-9]/g, '')}</groupId>
    <artifactId>${modId}</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>${name}</name>

    <properties>
        <java.version>17</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <repositories>
        ${repo}
    </repositories>

    <dependencies>
        ${dependency}
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>\${java.version}</source>
                    <target>\${java.version}</target>
                </configuration>
            </plugin>
        </plugins>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
</project>
`;
  }

  /**
   * Generate Forge main class
   */
  generateForgeMainClass(modId, packageName, displayName) {
    const className = this.toPascalCase(modId);
    return `package ${packageName};

import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.event.lifecycle.FMLClientSetupEvent;
import net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * ${displayName}
 * Created with MineAI IDE
 */
@Mod(${className}.MOD_ID)
public class ${className} {
    public static final String MOD_ID = "${modId}";
    private static final Logger LOGGER = LogManager.getLogger();

    public ${className}() {
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::setup);
        FMLJavaModLoadingContext.get().getModEventBus().addListener(this::clientSetup);
        MinecraftForge.EVENT_BUS.register(this);
        
        LOGGER.info("${displayName} initializing...");
    }

    private void setup(final FMLCommonSetupEvent event) {
        LOGGER.info("${displayName} common setup complete!");
    }

    private void clientSetup(final FMLClientSetupEvent event) {
        LOGGER.info("${displayName} client setup complete!");
    }
}
`;
  }

  /**
   * Generate Fabric main class
   */
  generateFabricMainClass(modId, packageName, displayName) {
    const className = this.toPascalCase(modId);
    return `package ${packageName};

import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * ${displayName}
 * Created with MineAI IDE
 */
public class ${className} implements ModInitializer {
    public static final String MOD_ID = "${modId}";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        LOGGER.info("${displayName} initializing...");
        
        // Register items, blocks, etc. here
        
        LOGGER.info("${displayName} initialized successfully!");
    }
}
`;
  }

  /**
   * Generate Plugin main class
   */
  generatePluginMainClass(modId, packageName, displayName) {
    const className = this.toPascalCase(modId);
    return `package ${packageName};

import org.bukkit.plugin.java.JavaPlugin;

/**
 * ${displayName}
 * Created with MineAI IDE
 */
public class ${className} extends JavaPlugin {

    @Override
    public void onEnable() {
        getLogger().info("${displayName} has been enabled!");
        
        // Register commands, listeners, etc. here
    }

    @Override
    public void onDisable() {
        getLogger().info("${displayName} has been disabled!");
    }
}
`;
  }

  /**
   * Get datapack format for MC version
   */
  getDatapackFormat(mcVersion) {
    const formats = {
      '1.20.4': 26, '1.20.3': 26, '1.20.2': 18, '1.20.1': 15, '1.20': 15,
      '1.19.4': 12, '1.19.3': 10, '1.19.2': 10, '1.19.1': 10, '1.19': 10,
      '1.18.2': 9, '1.18.1': 8, '1.18': 8,
      '1.17.1': 7, '1.17': 7,
      '1.16.5': 6, '1.16.4': 6, '1.16.3': 6, '1.16.2': 6, '1.16.1': 5, '1.16': 5,
      '1.15.2': 5, '1.15.1': 5, '1.15': 5,
      '1.14.4': 4, '1.14.3': 4, '1.14.2': 4, '1.14.1': 4, '1.14': 4,
      '1.13.2': 4, '1.13.1': 4, '1.13': 4
    };
    return formats[mcVersion] || 15;
  }

  /**
   * Get resource pack format for MC version
   */
  getResourcePackFormat(mcVersion) {
    const formats = {
      '1.20.4': 22, '1.20.3': 22, '1.20.2': 18, '1.20.1': 15, '1.20': 15,
      '1.19.4': 13, '1.19.3': 12, '1.19.2': 9, '1.19.1': 9, '1.19': 9,
      '1.18.2': 8, '1.18.1': 8, '1.18': 8,
      '1.17.1': 7, '1.17': 7,
      '1.16.5': 6, '1.16.4': 6, '1.16.3': 6, '1.16.2': 6,
      '1.15.2': 5, '1.14.4': 4, '1.13.2': 4
    };
    return formats[mcVersion] || 15;
  }

  /**
   * Convert string to PascalCase
   */
  toPascalCase(str) {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Load a project from path
   */
  async loadProject(projectPath) {
    try {
      const configPath = path.join(projectPath, 'mineai.config.json');
      const configContent = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(configContent);
      
      return {
        success: true,
        project: {
          ...config,
          path: projectPath
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all projects in the projects directory
   */
  async getAllProjects() {
    try {
      const entries = await fs.readdir(this.projectsDir, { withFileTypes: true });
      const projects = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectPath = path.join(this.projectsDir, entry.name);
          const result = await this.loadProject(projectPath);
          if (result.success) {
            projects.push(result.project);
          }
        }
      }

      return { success: true, projects };
    } catch (error) {
      return { success: false, error: error.message, projects: [] };
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectPath) {
    try {
      await fs.rm(projectPath, { recursive: true, force: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Export project as ZIP
   */
  async exportProject(projectPath, outputPath) {
    try {
      const zip = new AdmZip();
      zip.addLocalFolder(projectPath);
      zip.writeZip(outputPath);
      return { success: true, path: outputPath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Import project from ZIP
   */
  async importProject(zipPath, name) {
    try {
      const projectPath = path.join(this.projectsDir, name);
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(projectPath, true);
      return await this.loadProject(projectPath);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
export const projectManager = new ProjectManager();

export default ProjectManager;
