import pandas as pd
import os
import json
import re

# --- CONFIGURAÇÕES ---

# 1. O nome do arquivo Excel.
#    Como ele está NA MESMA PASTA que este script, basta o nome.
EXCEL_FILE = 'BATMAN.xlsx'

# 2. A pasta de saída para os JSONs.
#    '../data' significa "um nível acima, na pasta 'data'".
OUTPUT_DIR = '../data'

# --- FIM DAS CONFIGURAÇÕES ---


def normalize_filename(name):
    """Limpa o nome da aba para criar um nome de arquivo seguro."""
    # Remove caracteres inválidos
    name = re.sub(r'[\\/*?:"<>|]', "", name)
    # Substitui espaços e outros separadores por underscore
    name = re.sub(r'[\s/\[\]]+', '_', name.strip())
    # Remove underscores duplicados
    name = re.sub(r'__+', '_', name)
    # Remove underscore no início ou fim
    name = name.strip('_')
    return name.lower() + '.json'


def converter_planilha():
    """
    Lê todas as abas do Excel, salva cada uma como JSON na pasta
    de saída e cria um 'manifest.json' para o app web.
    """
    if not os.path.exists(EXCEL_FILE):
        print(f"--- ERRO! ---")
        print(f"Arquivo '{EXCEL_FILE}' não encontrado na pasta atual.")
        print(f"Verifique se o Excel está em: {os.getcwd()}")
        return

    # Garante que a pasta de saída exista
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Pasta de saída '{OUTPUT_DIR}' criada.")

    try:
        xls = pd.read_excel(EXCEL_FILE, sheet_name=None, engine='openpyxl')
    except Exception as e:
        print(f"Erro ao ler o arquivo Excel: {e}")
        return

    total_abas = len(xls.keys())
    manifesto_abas = {}  # Para guardar o mapa de abas
    print(f"Encontradas {total_abas} abas. Iniciando conversão...")

    for i, (nome_aba_original, df) in enumerate(xls.items()):
        
        # 1. Gera o nome do arquivo JSON
        nome_arquivo_json = normalize_filename(nome_aba_original)
        caminho_saida = os.path.join(OUTPUT_DIR, nome_arquivo_json)

        # 2. Adiciona ao manifesto
        #    Formato: "nome_amigavel_original": "caminho/do/arquivo.json"
        manifesto_abas[nome_aba_original] = f'data/{nome_arquivo_json}'

        # 3. Converte e Salva o JSON
        try:
            # Substitui NaT/NaN por strings vazias
            df_filled = df.fillna('')
            # Converte tudo para string para garantir
            df_string = df_filled.astype(str)
            
            dados_json = df_string.to_dict('records')
            
            with open(caminho_saida, 'w', encoding='utf-8') as f:
                json.dump(dados_json, f, ensure_ascii=False, indent=2)
                
            print(f"  ({i+1}/{total_abas}) Aba '{nome_aba_original}' -> salva como '{nome_arquivo_json}'")

        except Exception as e:
            print(f"Erro ao converter a aba '{nome_aba_original}': {e}")

    # 4. Salva o Manifesto
    caminho_manifesto = os.path.join(OUTPUT_DIR, 'manifest.json')
    try:
        with open(caminho_manifesto, 'w', encoding='utf-8') as f:
            json.dump(manifesto_abas, f, ensure_ascii=False, indent=2)
        print(f"\nManifesto de abas salvo em '{caminho_manifesto}'")
    except Exception as e:
        print(f"\nErro ao salvar o manifesto: {e}")

    print("\nConversão concluída com sucesso!")


if __name__ == "__main__":
    # Garante que o script está rodando do diretório correto
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    converter_planilha()