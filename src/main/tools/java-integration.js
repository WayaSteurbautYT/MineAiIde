/**
 * MineAI IDE - Java Integration Tools
 * Enhanced Java support for Minecraft modding with MCP integration
 */

import { spawn, exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JavaIntegration {
  constructor() {
    this.javaVersions = new Map();
    this.currentJavaVersion = null;
    this.minecraftVersions = new Map();
    this.moddingFrameworks = ['forge', 'fabric', 'quilt', 'neoforge'];
  }

  /**
   * Detect Java installations on the system
   */
  async detectJavaInstallations() {
    console.log('[Java Integration] Detecting Java installations...');
    
    const javaPaths = [
      'java',
      'javac',
      '/usr/bin/java',
      '/usr/local/bin/java',
      'C:\\Program Files\\Java\\*\\bin\\java.exe',
      'C:\\Program Files (x86)\\Java\\*\\bin\\java.exe'
    ];

    const installations = [];

    for (const javaPath of javaPaths) {
      try {
        const version = await this.getJavaVersion(javaPath);
        if (version) {
          installations.push({
            path: javaPath,
            version: version,
            type: this.getJavaType(version)
          });
        }
      } catch (error) {
        // Skip invalid paths
      }
    }

    this.javaVersions = new Map(installations.map(inst => [inst.version, inst]));
    console.log(`[Java Integration] Found ${installations.length} Java installations`);
    
    return installations;
  }

  /**
   * Get Java version information
   */
  async getJavaVersion(javaPath = 'java') {
    return new Promise((resolve, reject) => {
      exec(`"${javaPath}" -version 2>&1`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        const versionMatch = stderr.match(/version "([^"]+)"/);
        if (versionMatch) {
          resolve(versionMatch[1]);
        } else {
          reject(new Error('Could not parse Java version'));
        }
      });
    });
  }

  /**
   * Determine Java type (JDK/JRE) from version
   */
  getJavaType(version) {
    return version.includes('jdk') || version.includes('JDK') ? 'JDK' : 'JRE';
  }

  /**
   * Set up Java environment for Minecraft modding
   */
  async setupJavaEnvironment(minecraftVersion, framework = 'forge') {
    console.log(`[Java Integration] Setting up Java for Minecraft ${minecraftVersion} (${framework})`);

    const requiredJavaVersion = this.getRequiredJavaVersion(minecraftVersion, framework);
    const javaInstallation = this.findCompatibleJava(requiredJavaVersion);

    if (!javaInstallation) {
      throw new Error(`No compatible Java installation found for ${requiredJavaVersion}`);
    }

    this.currentJavaVersion = javaInstallation;
    
    const environment = {
      JAVA_HOME: this.extractJavaHome(javaInstallation.path),
      PATH: `${this.extractJavaHome(javaInstallation.path)}\\bin;${process.env.PATH}`,
      JAVA_VERSION: javaInstallation.version,
      MINECRAFT_VERSION: minecraftVersion,
      FRAMEWORK: framework
    };

    console.log(`[Java Integration] Java environment configured:`, environment);
    return environment;
  }

  /**
   * Get required Java version for Minecraft version
   */
  getRequiredJavaVersion(minecraftVersion, framework) {
    const requirements = {
      '1.20.4': { forge: '17', fabric: '17', quilt: '17', neoforge: '17' },
      '1.20.1': { forge: '17', fabric: '17', quilt: '17', neoforge: '17' },
      '1.19.4': { forge: '17', fabric: '17', quilt: '17', neoforge: '17' },
      '1.19.2': { forge: '17', fabric: '17', quilt: '17', neoforge: '17' },
      '1.18.2': { forge: '17', fabric: '17', quilt: '17', neoforge: '17' },
      '1.16.5': { forge: '8', fabric: '8', quilt: '8', neoforge: '8' },
      '1.12.2': { forge: '8', fabric: '8', quilt: '8', neoforge: '8' }
    };

    return requirements[minecraftVersion]?.[framework] || '17';
  }

  /**
   * Find compatible Java installation
   */
  findCompatibleJava(requiredVersion) {
    for (const [version, installation] of this.javaVersions) {
      if (version.includes(requiredVersion) || version.startsWith(requiredVersion)) {
        return installation;
      }
    }
    return null;
  }

  /**
   * Extract JAVA_HOME from java path
   */
  extractJavaHome(javaPath) {
    if (javaPath === 'java' || javaPath === 'javac') {
      return process.env.JAVA_HOME || '';
    }
    
    const pathParts = javaPath.split(path.sep);
    const binIndex = pathParts.lastIndexOf('bin');
    if (binIndex > 0) {
      return pathParts.slice(0, binIndex).join(path.sep);
    }
    
    return javaPath;
  }

  /**
   * Compile Java files with proper classpath
   */
  async compileJava(sourceDir, outputDir, classpath = []) {
    console.log(`[Java Integration] Compiling Java files from ${sourceDir}`);

    const classpathStr = classpath.join(path.delimiter);
    const javacPath = this.currentJavaVersion?.path?.replace('java', 'javac') || 'javac';

    return new Promise((resolve, reject) => {
      const compileProcess = spawn(javacPath, [
        '-d', outputDir,
        '-cp', classpathStr,
        `${sourceDir}/**/*.java`
      ], {
        env: { ...process.env, JAVA_HOME: this.currentJavaVersion?.JAVA_HOME }
      });

      let stdout = '';
      let stderr = '';

      compileProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      compileProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      compileProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`[Java Integration] Compilation successful`);
          resolve({ success: true, stdout, stderr });
        } else {
          console.error(`[Java Integration] Compilation failed with code ${code}`);
          reject(new Error(`Compilation failed: ${stderr}`));
        }
      });
    });
  }

  /**
   * Run Java application with proper environment
   */
  async runJava(mainClass, classpath, args = []) {
    console.log(`[Java Integration] Running Java application: ${mainClass}`);

    const classpathStr = classpath.join(path.delimiter);
    const javaPath = this.currentJavaVersion?.path || 'java';

    return new Promise((resolve, reject) => {
      const runProcess = spawn(javaPath, [
        '-cp', classpathStr,
        mainClass,
        ...args
      ], {
        env: { ...process.env, JAVA_HOME: this.currentJavaVersion?.JAVA_HOME }
      });

      let stdout = '';
      let stderr = '';

      runProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      runProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      runProcess.on('close', (code) => {
        resolve({ exitCode: code, stdout, stderr });
      });
    });
  }

  /**
   * Generate Minecraft mod template
   */
  async generateModTemplate(projectPath, modId, modName, framework, minecraftVersion) {
    console.log(`[Java Integration] Generating ${framework} mod template for ${modName}`);

    const templateDir = path.join(__dirname, `../templates/${framework}`);
    const targetDir = path.join(projectPath, 'src/main/java');

    // Create directory structure
    await fs.mkdir(targetDir, { recursive: true });

    // Generate main mod class
    const modClass = this.generateModClass(modId, modName, framework, minecraftVersion);
    const packagePath = path.join(targetDir, modId.replace('-', '/'));
    await fs.mkdir(packagePath, { recursive: true });
    await fs.writeFile(path.join(packagePath, `${this.capitalizeFirst(modId)}Mod.java`), modClass);

    // Generate build configuration
    const buildConfig = this.generateBuildConfig(framework, minecraftVersion, modId, modName);
    await fs.writeFile(path.join(projectPath, 'build.gradle'), buildConfig);

    // Generate mod metadata
    const metadata = this.generateModMetadata(framework, modId, modName, minecraftVersion);
    const metadataPath = this.getMetadataPath(framework, projectPath);
    await fs.writeFile(metadataPath, metadata);

    console.log(`[Java Integration] Mod template generated successfully`);
    return { success: true, projectPath, modId, framework };
  }

  /**
   * Generate main mod class content
   */
  generateModClass(modId, modName, framework, minecraftVersion) {
    const templates = {
      forge: `package ${modId.replace('-', '.')};

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(${modId}.MOD_ID)
public class ${this.capitalizeFirst(modId)}Mod {
    public static final String MOD_ID = "${modId}";
    public static final String MOD_NAME = "${modName}";

    public ${this.capitalizeFirst(modId)}Mod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        
        // Register mod event bus listeners here
        modEventBus.addListener(this::commonSetup);
    }

    private void commonSetup(final net.minecraftforge.event.entity.EntityAttributeCreationEvent event) {
        // Common setup logic
    }
}`,
      fabric: `package ${modId.replace('-', '.')};

import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ${this.capitalizeFirst(modId)}Mod implements ModInitializer {
    public static final String MOD_ID = "${modId}";
    public static final String MOD_NAME = "${modName}";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_NAME);

    @Override
    public void onInitialize() {
        LOGGER.info("Initializing {} mod", MOD_NAME);
        
        // Mod initialization logic here
    }
}`
    };

    return templates[framework] || templates.forge;
  }

  /**
   * Generate build.gradle configuration
   */
  generateBuildConfig(framework, minecraftVersion, modId, modName) {
    const configs = {
      forge: `plugins {
    id 'eclipse'
    id 'maven-publish'
    id 'net.minecraftforge.gradle' version '6.0.+'
}

version = '1.0.0'
group = modId
archivesBaseName = modId

java.toolchain.languageVersion = JavaLanguageVersion.of(17)

minecraft {
    mappings channel: 'official', version: '${minecraftVersion}'
    
    runs {
        client {
            workingDirectory project.file('run')
            property 'forge.logging.markers', 'REGISTRIES'
            property 'forge.logging.console.level', 'debug'
            mods {
                ${modId} {
                    source sourceSets.main
                }
            }
        }
        
        server {
            workingDirectory project.file('run')
            property 'forge.logging.markers', 'REGISTRIES'
            property 'forge.logging.console.level', 'debug'
            mods {
                ${modId} {
                    source sourceSets.main
                }
            }
        }
    }
}

dependencies {
    minecraft 'net.minecraftforge:forge:${minecraftVersion}-46.0.14'
}

jar {
    manifest {
        attributes([
            "Specification-Title": modName,
            "Specification-Vendor": "MineAI IDE",
            "Specification-Version": "1",
            "Implementation-Title": project.name,
            "Implementation-Version": project.version,
            "Implementation-Vendor": "MineAI IDE"
        ])
    }
}`,
      fabric: `plugins {
    id 'fabric-loom' version '1.0-SNAPSHOT'
    id 'maven-publish'
}

version = '1.0.0'
group = modId

repositories {
    mavenCentral()
}

dependencies {
    minecraft "com.mojang:minecraft:${minecraftVersion}"
    mappings "net.fabricmc:yarn:${minecraftVersion}+build.1"
    modImplementation "net.fabricmc:fabric-loader:0.14.21"
}

processResources {
    inputs.property "version", project.version

    filesMatching("fabric.mod.json") {
        expand "version": project.version
    }
}

java {
    withSourcesJar()
}

jar {
    from("LICENSE") {
        rename { "\${it}_${modId}"}
    }
}`
    };

    return configs[framework] || configs.forge;
  }

  /**
   * Generate mod metadata
   */
  generateModMetadata(framework, modId, modName, minecraftVersion) {
    const metadata = {
      forge: `{
    "modLoader": "javafml",
    "loaderVersion": "[46,)",
    "mods": [
        {
            "modId": "${modId}",
            "version": "1.0.0",
            "displayName": "${modName}",
            "description": "A Minecraft mod created with MineAI IDE",
            "authors": ["MineAI IDE"],
            "license": "MIT"
        }
    ]
}`,
      fabric: `{
    "schemaVersion": 1,
    "id": "${modId}",
    "version": "1.0.0",
    "name": "${modName}",
    "description": "A Minecraft mod created with MineAI IDE",
    "authors": ["MineAI IDE"],
    "license": "MIT",
    "environment": "*",
    "entrypoints": {
        "main": [
            "${modId.replace('-', '.')}.${this.capitalizeFirst(modId)}Mod"
        ]
    },
    "depends": {
        "fabricloader": ">=0.14.21",
        "minecraft": "~${minecraftVersion}",
        "java": ">=17"
    }
}`
    };

    return metadata[framework] || metadata.forge;
  }

  /**
   * Get metadata file path for framework
   */
  getMetadataPath(framework, projectPath) {
    const paths = {
      forge: path.join(projectPath, 'src/main/resources/META-INF/mods.toml'),
      fabric: path.join(projectPath, 'src/main/resources/fabric.mod.json')
    };
    
    return paths[framework] || paths.forge;
  }

  /**
   * Capitalize first letter of string
   */
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default JavaIntegration;
