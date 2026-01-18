// js/fraseologias.js
// BASE DE DADOS DE FRASEOLOGIAS (Cópia Fiel do mkacete.py)

window.FRASEOLOGIAS_DATA = {
    // 1. NEGATIVAS E RESTRIÇÕES (Texto Jurídico Completo)
    "negativas": [
        {
            id: '01',
            nome: '01 -> 01 - CARÊNCIA CONTRATUAL',
            template: "Prezado(a) Sr(a). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nNO MOMENTO SUA SOLICITAÇÃO: {procedimento} FOI INDEFERIDA POR CARÊNCIA CONTRATUAL.\n\nEXCETO CONSULTA E EXAMES DE URGÊNCIA SOLICITAMOS UMA NOVA ABERTURA DE DEMANDA PARA ESSE PROCEDIMENTO A PARTIR DA DATA: {data_disponivel}.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '02',
            nome: '02 -> 02 - CONTRATO NÃO INICIADO EM PERÍODO DE VIGÊNCIA',
            template: "Prezado(a) Sr(a). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nA atuação da Operadora Hapvida está vinculada à regulação do Governo Federal, através da Agência Nacional de Saúde Suplementar - ANS, Autarquia Federal reguladora do referido setor de saúde. O contrato de plano de saúde individual ou familiar tem início de vigência a partir da data de assinatura da proposta de adesão, da assinatura do contrato ou da data de pagamento da mensalidade, o que ocorrer primeiro. No tocante aos contratos coletivos, a operadora de saúde e a pessoa jurídica contratante possuem liberdade para negociar o início da vigência, desde que até a data pactuada não haja qualquer pagamento. Verificando o contrato de Vossa Senhoria, identificou-se que o mesmo está com início de vigência programado para o dia {data_vigencia}. Dessa forma, apenas após tal data é que os serviços cobertos pela operadora poderão ser solicitados, observados os prazos de carências contratuais e legais.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '04',
            nome: '04 -> 25 - EXCLUSÃO DE COBERTURA (AMBULATORIAL)',
            template: "Prezado(a) Sr(a). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nA atuação da Operadora Hapvida está vinculada à regulação do Governo Federal, através da Agência Nacional de Saúde Suplementar - ANS, Autarquia Federal reguladora do referido setor de saúde. As coberturas são estabelecidas pela ANS, conforme previsto no Rol de Procedimentos e Eventos em Saúde, e determinadas pela Resolução Normativa n°. 465/2021, sob o amparo da Lei Federal n°. 9656/98. Após análise da solicitação de {procedimento01}, esta restou indeferida, pois verificou-se que o(a) beneficiário(a) é contratante de plano com segmentação exclusivamente AMBULATORIAL, registrado na Agência Nacional de Saúde Suplementar - ANS sob o nº XXX, sem direito à internação e/ou cirurgias. É válido salientar, que o plano de cobertura ambulatorial não abrange quaisquer atendimentos que necessitem de suporte em internação hospitalar, uma vez que a referida cobertura compreende, tão somente, consultas médicas em clínicas ou consultórios, exames, tratamento e demais procedimentos ambulatoriais, nos termos inciso I, do art. 12 da Lei Federal n° 9.656/1998 e do art. 18 da Resolução Normativa n°. 465/2021 da Agência Nacional de Saúde Suplementar. Dessa forma, o pedido para autorização do procedimento de {procedimento02}, não foi aprovado, por não se enquadrar em condições de cobertura contratualmente pactuadas. EM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '08',
            nome: '08 -> 44 - LIMITE CONTRATUAL',
            template: "Prezado(a) Sr(a). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nA atuação da Operadora Hapvida está vinculada à regulação do Governo Federal, através da Agência Nacional de Saúde Suplementar - ANS, Autarquia Federal reguladora do referido setor de saúde. As coberturas são estabelecidas pela ANS, conforme previsto no Rol de Procedimentos e Eventos em Saúde, e determinadas pela Resolução Normativa n°. 465/2021, sob o amparo da Lei Federal n°. 9656/98. O contrato de V.S.ª. trata-se de plano antigo, ou seja, foi comercializado antes da vigência da Lei 9.656/98. Tais planos possuem como característica a auto aplicabilidade de suas cláusulas, principalmente quanto aos eventos cobertos e excluídos. Sendo assim, a relação contratual estabelecida entre as partes é regida pelos termos exatos do contrato firmado. Em análise, pudemos verificar que o limite contratual foi excedido. Diante do exposto, a solicitação para autorização do procedimento {procedimento} acima mencionado não foi aprovada, por se tratar de pedido não coberto em contrato de plano de saúde não regulamentado, isto é, anterior à vigência da Lei nº 9.656/98.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '12',
            nome: '12 -> 46 - INADIMPLÊNCIA CONTRATO COLETIVO',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nINFORMAMOS QUE, PARA DAR CONTINUIDADE AO ATENDIMENTO, É NECESSÁRIO QUE O(A) SENHOR(A) ENTRE EM CONTATO COM O SETOR DE RECURSOS HUMANOS (RH) DA SUA EMPRESA.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '16',
            nome: '16 -> 61 - ÁREA DE ATUAÇÃO CONTRATUAL INCOMPATÍVEL',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nA atuação da Operadora Hapvida está vinculada à regulação do Governo Federal, através da Agência Nacional de Saúde Suplementar - ANS, Autarquia Federal reguladora do referido setor de saúde. As coberturas são estabelecidas pela ANS, conforme previsto no Rol de Procedimentos e Eventos em Saúde determinado pela Resolução Normativa N° 465/2021, bem como, os critérios estabelecidos pela Lei Federal N° 9.656/1998. Vossa Senhoria possui plano vinculado a esta operadora registrado na ANS sob o número XXX, com área de abrangência geográfica Grupo de XXX. Cumpre esclarecer que as operadoras de planos de assistência à saúde podem ofertar planos com área de abrangência Nacional, Estadual, de Grupo de Estados, Municipal ou de Grupo de Municípios, conforme esclarece item 4, do Anexo, da Resolução Normativa N° 543/2022, da Agência Nacional de Saúde Suplementar. Assim, vale enfatizar que o plano de saúde tem como área de atuação, tão somente, nos municípios ou estados albergados no referido tipo de plano contratado, com atendimento através dos médicos e prestadores indicados no Manual de Orientação do Beneficiário e Portal da Operadora, dentre os quais, não inclui a cidade de {cidade_estado}. Dessa forma, o pedido para autorização de {procedimento} acima mencionado, em atenção ao contrato celebrado, não foi aprovado, por não se enquadrar em condições de cobertura estabelecidas no instrumento contratual, haja vista estar fora da área de abrangência.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '24',
            nome: '24 -> 41 - PERDA QUALIDADE DE BENEFICIÁRIO',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nA atuação da Operadora Hapvida está vinculada à regulação do Governo Federal, através da Agência Nacional de Saúde Suplementar - ANS, Autarquia Federal reguladora do referido setor de saúde. As coberturas são estabelecidas pela ANS, conforme previsto no Rol de Procedimentos e Eventos em Saúde, e determinadas pela Resolução Normativa n°. 465/2021, sob o amparo da Lei Federal n°. 9656/98. Após análise da solicitação de {procedimento}, esta restou indeferida, pois em conformidade com o Contrato, os serviços médicos prestados por esta operadora foram rescindidos, visto que vossa senhoria perdeu a qualidade de beneficiário.\n\nSOLICITAMOS UMA NOVA ABERTURA COM CARTEIRINHA ATIVA. \n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '26',
            nome: '26 -> 72 - USUÁRIO É ATENDIDO POR OUTRA ASSISTÊNCIA',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nNO MOMENTO SUA SOLICITAÇÃO FOI INDEFERIDA POR USUÁRIO É ATENDIDO POR OUTRA ASSISTÊNCIA.\n\nA atuação da Operadora Hapvida está vinculada à regulação do Governo Federal, através da Agência Nacional de Saúde Suplementar - ANS, Autarquia Federal reguladora do referido setor de saúde. As coberturas são estabelecidas pela ANS, conforme previsto no Rol de Procedimentos e Eventos em Saúde, e determinadas pela Resolução Normativa n°. 465/2021, sob o amparo da Lei Federal n°. 9656/98. A Operadora deve garantir o acesso do beneficiário aos serviços e procedimentos definidos no Rol de Procedimentos e Eventos em Saúde da ANS, conforme os prazos da Resolução Normativa nº. 566/2022. A Resolução Normativa nº. 465/2021, que estabelece o Rol de Procedimentos e Eventos em Saúde, referência básica para cobertura assistencial mínima, em seu artigo 1º, §2º, assim dispõe: “A cobertura assistencial estabelecida por esta Resolução Normativa e seus anexos será obrigatória independente da circunstância e do local de ocorrência do evento que ensejar o atendimento, respeitadas as segmentações, a área de atuação e de abrangência, a rede de prestadores de serviços contratada, credenciada ou referenciada da operadora, os prazos de carência e a cobertura parcial temporária – CPT. Em relação à solicitação do procedimento de {procedimento}, verificamos que V.S.ª. está vinculado ao plano {nome_plano}, com prestação de serviço por outra Operadora de Saúde. Sendo assim, por não possuir previsão para prestadores dessa Operadora, referido procedimento fora indeferido.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '48',
            nome: '48 -> 25 - PLANO AMBULATORIAL (SEM INTERNAÇÃO)',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nA atuação da Operadora Hapvida está vinculada à regulação do Governo Federal, através da Agência Nacional de Saúde Suplementar - ANS, Autarquia Federal reguladora do referido setor de saúde. As coberturas são estabelecidas pela ANS, conforme previsto no Rol de Procedimentos e Eventos em Saúde, e determinadas pela Resolução Normativa n°. 465/2021, sob o amparo da Lei Federal n°. 9656/98.Após análise da solicitação de {procedimento01}, esta restou indeferida, pois verificou-se que o(a) beneficiário(a) é contratante de plano com segmentação exclusivamente AMBULATORIAL, registrado na Agência Nacional de Saúde Suplementar - ANS sob o nº XXX, sem direito à internação e/ou cirurgias. É válido salientar, que o plano de cobertura ambulatorial não abrange quaisquer atendimentos que necessitem de suporte em internação hospitalar, uma vez que a referida cobertura compreende, tão somente, consultas médicas em clínicas ou consultórios, exames, tratamento e demais procedimentos ambulatoriais, nos termos inciso I, do art. 12 da Lei Federal n° 9.656/1998 e do art. 18 da Resolução Normativa n°. 465/2021 da Agência Nacional de Saúde Suplementar. Dessa forma, o pedido para autorização do procedimento de {procedimento02}, não foi aprovado, por não se enquadrar em condições de cobertura contratualmente pactuadas.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '49',
            nome: '49 -> 25 - PLANO HOSPITALAR (SEM AMBULATORIAL)',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nA atuação da Operadora Hapvida está vinculada à regulação do Governo Federal, através da Agência Nacional de Saúde Suplementar - ANS, Autarquia Federal reguladora do referido setor de saúde. As coberturas são estabelecidas pela ANS, conforme previsto no Rol de Procedimentos e Eventos em Saúde, e determinadas pela Resolução Normativa n°. 465/2021, sob o amparo da Lei Federal n°. 9656/98. Após análise da solicitação de {procedimento01}, esta restou indeferida, pois verificou-se que o beneficiário(a) é contratante de plano com segmentação exclusivamente HOSPITALAR, registrado na Agência Nacional de Saúde Suplementar - ANS sob o nº XXX, não incluindo atendimentos ambulatoriais para fins de diagnóstico, terapia ou recuperação. É válido salientar que, o plano de cobertura hospitalar compreende os atendimentos realizados em todas as modalidades de internação hospitalar e os atendimentos caracterizados como de urgência e emergência, nos termos inciso II, do art. 12 da Lei Federal n° 9.656/1998 e do art. 19 da Resolução Normativa n°. 465/2021 da Agência Nacional de Saúde Suplementar. Dessa forma, o pedido para autorização do procedimento de {procedimento02}, não foi aprovado, por não se enquadrar em condições de cobertura contratualmente pactuadas.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: '103',
            nome: '103 -> 74 – PLANO SUSPENSO PESSOA FÍSICA',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_]\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nA atuação da Operadora Hapvida está vinculada à regulação do Governo Federal, através da Agência Nacional de Saúde Suplementar - ANS, Autarquia Federal reguladora do referido setor de saúde. As coberturas são estabelecidas pela ANS, conforme previsto no Rol de Procedimentos e Eventos em Saúde determinado pela Resolução Normativa n°. 465/2021, bem como, os critérios estabelecidos pela Lei Federal n°. 9.656/1998. Após análise da presente solicitação, esta restou indeferida, pois em conformidade com os termos da Lei nº 9656/98 – art. 13, inciso II, bem como, cumprimento de todos os requisitos da RN 593/24 – art. 4º, §3º, os serviços médicos prestados por esta operadora foram SUSPENSOS, visto que vossa senhoria se encontra com pendência financeiras\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        }
    ],

    // 2. AUTORIZAÇÃO (Lógica Especial)
    "autorizacao": {
        template_intro: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_],\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nSUA SOLICITAÇÃO DE AUTORIZAÇÃO PARA EXAME FOI RECEBIDA COM OS SEGUINTES DADOS:",
        template_item: "\nPROCEDIMENTO: {procedimento}\nSENHA: {senha}\nPRESTADOR: {prestador}",
        template_fim: "\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
    },

    // 3. FINALIZAÇÃO (FERRAMENTAS_FINALIZACAO do Python)
    "finalizacao": [
        {
            id: 'ANALISE',
            nome: 'AUDITORIA E CREDENCIAMENTO',
            template: "PREZADO(A) [_NM_BENEFICIARIO_],\nSUA SOLICITAÇÃO DE AUTORIZAÇÃO, PROTOCOLADA SOB [_NU_PROTOCOLO_], ESTÁ EM ANÁLISE.\n\nACOMPANHE O STATUS PELO SEU E-MAIL, SITE OU APLICATIVO.\n\nEM CASO DE DÚVIDAS, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELO TELEFONE 4090-1740 OU 0800 409 1740."
        },
        {
            id: 'CARTEIRINHA_INCORRETA',
            nome: 'CARTEIRINHA INCORRETA',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_],\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nVERIFICAMOS QUE A GUIA ENCAMINHADA CONSTA EM NOME DE OUTRO BENEFICIÁRIO.\nPOR GENTILEZA, SOLICITAMOS QUE ABRA A DEMANDA UTILIZANDO A CARTEIRINHA CORRETA, CORRESPONDENTE AO NOME QUE CONSTA NA GUIA, PARA QUE POSSAMOS DAR CONTINUIDADE AO ATENDIMENTO.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: 'FALTA_DOCUMENTACAO_48H',
            nome: 'ORIENTAÇÃO SOBRE PRAZO DE 48 HORAS',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_],\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nINFORMAMOS QUE O PROCEDIMENTO SOLICITADO FOI CANCELADO DEVIDO À NÃO APRESENTAÇÃO {documentacao}, DENTRO DO PRAZO DE 48 HORAS, CONFORME ESTABELECIDO NAS DIRETRIZES OPERACIONAIS DA OPERADORA.\n\nPARA DAR CONTINUIDADE AO PROCESSO, SERÁ NECESSÁRIO ABRIR UMA NOVA SOLICITAÇÃO, JÁ COM A PRESCRIÇÃO MÉDICA ATUALIZADA ANEXADA NO MOMENTO DO PEDIDO.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: 'DOCUMENTACAO_RECEBIDA_48H',
            nome: 'RETORNO DE AGRADECIMENTO AO RECEBER DOCUMENTAÇÃO',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_],\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nAGRADECEMOS O ENVIO DO(S) DOCUMENTO(S)/EXAME(S) SOLICITADO(S). GENTILEZA PERMANECER ACOMPANHANDO SUA SOLICITAÇÃO ATRAVÉS DO SITE/APP.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: 'PROCEDIMENTO_REALIZADO',
            nome: 'PROCEDIMENTO JÁ REALIZADO',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_],\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nPROCEDIMENTO JÁ CONSTA REALIZADO EM SISTEMA.\n\nPROCEDIMENTO: {procedimento}\nSENHA: {senha}\nPRESTADOR: {prestador}\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: 'FALTA_DOCUMENTACAO',
            nome: 'FALTA DE DOCUMENTAÇÃO',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_],\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nSOLICITAMOS O ANEXO DAS IMAGENS LEGÍVEIS DAS SOLICITAÇÕES MÉDICAS, PARA AS QUAIS DESEJA SOLICITAR AUTORIZAÇÃO.\n\nANEXAR DOCUMENTAÇÃO EM FORMATO PDF OU JPEG.\n\nEM CASO DE DÚVIDAS, POR FAVOR, ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO PELOS TELEFONES: 4090-1740, 0800 409 1740 OU 0800 463 4648."
        },
        {
            id: 'ORIENTACAO_ODONTO',
            nome: 'ORIENTAÇÃO ODONTOLÓGICA',
            template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_],\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nVERIFICAMOS QUE O PROCEDIMENTO SOLICITADO DEVE SER REQUERIDO POR MEIO DO SEU PLANO ODONTOLÓGICO.\nORIENTAMOS QUE ENTRE EM CONTATO COM A CENTRAL DE ATENDIMENTO OU ACESSE OS CANAIS DIGITAIS PARA REALIZAR A SOLICITAÇÃO CONFORME AS COBERTURAS E REGRAS DO PLANO.\n\nEM CASO DE DÚVIDAS, ENTRE EM CONTATO COM A NOSSA CENTRAL DE ATENDIMENTO PELOS NÚMEROS: 0800 463 4648, 4090 1740 OU 0800 409 1740."
        }
    ],

    // 4. REEMBOLSO (FERRAMENTAS_TEXTO do Python)
    "reembolso": {
        template: "PREZADO(A) SR(A). [_NM_BENEFICIARIO_],\n\nNÚMERO DO PROTOCOLO: [_NU_PROTOCOLO_]\n\nInformamos que as solicitações de reembolso devem ser realizadas exclusivamente por meio do Portal GNDI.\n\nPara sua conveniência, acesse:\n\nOs canais de atendimento aos beneficiários:\n\n->Aplicativo Hapvida NotreDame\n->Disponível para Android e iOS\n\n-> Portal do Beneficiário\n-> www.gndi.com.br\n\nNo ambiente digital, será possível acompanhar o status da solicitação e obter informações detalhadas sobre o andamento do reembolso.\n\nEm caso de dúvidas, nossa equipe de atendimento permanece à disposição pelos canais oficiais da operadora: 4090-1740, 0800 409 1740 OU 0800 463 4648."
    }
};