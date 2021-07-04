# FFFD (FitFel Filmová Databáze) 
Aplikace se skládá ze 2 částí: adminská a uživatelská. Uživatelská část umožňuje prohlížet filmy, jejich detaily, hodnotit je, prohlížet ohodnocené filmy uživatele, zobrazovat profily ostatních uživatelů
a primárně zobrazovat doporučené filmy na základě mých ohodnocení. Adminská část prohlížet uživatele a kalibrovat parametry algoritmu pro doporučování 
obsahu uživatelům.

# Postup pro spuštění:
Soubor env-example přejmenujte na .env a upravte parametry v něm pro připojení k databázi. 
<br>
SERVER_PORT<br>
JWT_TOKEN<br>
NODE_ENV<br>

Nástroje pro spuštění:
npm (node package manager), Docker a Docker-compose. Otevřete root složku pomocí bash terminálu a spusťtě script run.sh, který se postará o sestavení s puštění aplikaci pomocí Docker-compose. Aplikace je poté dostupná na portu 80.