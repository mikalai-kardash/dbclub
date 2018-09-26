[CmdletBinding()]
Param(
    [Parameter(Mandatory = $false)]
    [switch]$init,

    [Parameter(Mandatory = $false)]
    [switch]$stop
)

$base = Get-Location | Split-Path -Leaf
$root = (Get-Location).Path

if ($stop -eq $false) {
    docker-compose up -d
}
else {
    docker-compose down
}

if ($init -eq $true) {
    $network = docker network ls `
        --filter "name=$base" `
        --format '{{.ID}}'

    docker run `
        --link "$($base)_db_1:db" `
        --network "$network" `
        -v "$root/test_db:/test_db" `
        -it --rm `
        mysql:5.7 sh -c 'cd /test_db && mysql -hdb -uroot -proot-password < /test_db/employees.sql'

}

if (-not $null -eq $env:DOCKER_TOOLBOX_INSTALL_PATH) {
    $ip = docker-machine ip
    Write-Host "Docker Toolbox is running on $ip"
}
